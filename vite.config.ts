import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MockEndpointConfig {
  route: string;
  buildResponse: (data: Record<string, unknown>) => Record<string, unknown>;
}

/** Generic mock API plugin factory for dev server */
function mockApiPlugin(name: string, config: MockEndpointConfig): Plugin {
  return {
    name: `mock-${name}-api`,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === "POST" && req.url === config.route) {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            try {
              const body = Buffer.concat(chunks).toString();
              const data = JSON.parse(body || "{}") as Record<string, unknown>;
              const response = config.buildResponse(data);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(response));
            } catch {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

/** Mock endpoint: Job applications */
function mockApplicationsApi(): Plugin {
  return mockApiPlugin("applications", {
    route: "/api/applications",
    buildResponse: (data) => ({
      success: true,
      message: "Application received successfully",
      applicationId: `app-${Date.now()}`,
      ...data
    })
  });
}

/** Mock endpoint: Contact form */
function mockContactApi(): Plugin {
  return mockApiPlugin("contact", {
    route: "/api/contact",
    buildResponse: (data) => ({
      success: true,
      message: "Contact request received. We'll get back to you soon!",
      contactId: `cnt-${Date.now()}`,
      ...data
    })
  });
}

/** Mock endpoint: Survey responses */
function mockSurveyApi(): Plugin {
  return mockApiPlugin("survey", {
    route: "/api/survey",
    buildResponse: (data) => {
      // Compute average rating from rating fields
      const ratingKeys = [
        "overall_satisfaction", "ease_of_use", "performance",
        "customer_support", "value_for_money"
      ];
      const ratings = ratingKeys
        .map((key) => data[key])
        .filter((v): v is number => typeof v === "number");
      const averageRating = ratings.length > 0
        ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : null;

      return {
        success: true,
        message: "Survey response recorded. Thank you for your feedback!",
        surveyId: `srv-${Date.now()}`,
        averageRating,
        ...data
      };
    }
  });
}

export default defineConfig({
  plugins: [
    mockApplicationsApi(),
    mockContactApi(),
    mockSurveyApi(),
    dts({ 
      include: ['src/formshell/**/*.ts'],
      outDir: 'dist',
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/formshell/index.ts'),
      name: 'FormShell',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});
