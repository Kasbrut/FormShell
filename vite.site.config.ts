/**
 * Vite config for building the examples webapp (GitHub Pages).
 *
 * This is completely separate from the library build in vite.config.ts.
 * It produces a standard web application in "site-dist/" that can be
 * statically hosted (e.g. on GitHub Pages).
 *
 * Usage:
 *   pnpm run build:site   – build the static site
 *   pnpm run preview:site – preview the built site locally
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Mock-API plugin (dev server only) ───────────────────────────────────────

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

function mockSurveyApi(): Plugin {
  return mockApiPlugin("survey", {
    route: "/api/survey",
    buildResponse: (data) => {
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

// ─── Client-side mock for production (static hosting) ────────────────────────

/**
 * Injects a small script into the built HTML that intercepts fetch() calls
 * to the mock API endpoints, so the demo works even on static hosting
 * where there is no backend server.
 */
function clientMockApiPlugin(): Plugin {
  return {
    name: "client-mock-api",
    transformIndexHtml(html) {
      const mockScript = `
<script>
(function () {
  var originalFetch = window.fetch;
  var mockEndpoints = {
    "/api/contact": function (data) {
      return {
        success: true,
        message: "Contact request received. We'll get back to you soon!",
        contactId: "cnt-" + Date.now(),
        ...data
      };
    },
    "/api/applications": function (data) {
      return {
        success: true,
        message: "Application received successfully",
        applicationId: "app-" + Date.now(),
        ...data
      };
    },
    "/api/survey": function (data) {
      var ratingKeys = [
        "overall_satisfaction", "ease_of_use", "performance",
        "customer_support", "value_for_money"
      ];
      var ratings = ratingKeys.map(function (k) { return data[k]; })
        .filter(function (v) { return typeof v === "number"; });
      var averageRating = ratings.length > 0
        ? Number((ratings.reduce(function (a, b) { return a + b; }, 0) / ratings.length).toFixed(1))
        : null;
      return {
        success: true,
        message: "Survey response recorded. Thank you for your feedback!",
        surveyId: "srv-" + Date.now(),
        averageRating: averageRating,
        ...data
      };
    }
  };

  window.fetch = function (input, init) {
    try {
      var url = typeof input === "string" ? input : input.url;
      var pathname = new URL(url, window.location.origin).pathname;
      if (init && init.method === "POST" && mockEndpoints[pathname]) {
        var body = {};
        try { body = JSON.parse(init.body || "{}"); } catch (_) {}
        var responseData = mockEndpoints[pathname](body);
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve(new Response(JSON.stringify(responseData), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }));
          }, 300);
        });
      }
    } catch (_) {}
    return originalFetch.apply(this, arguments);
  };
})();
</script>`;

      return html.replace("</head>", mockScript + "\n</head>");
    }
  };
}

// ─── Vite config ─────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    // Dev server mock APIs (only active during `vite dev`)
    mockApplicationsApi(),
    mockContactApi(),
    mockSurveyApi(),
    // Client-side mock injected into the built HTML
    clientMockApiPlugin()
  ],

  // GitHub Pages serves from https://<user>.github.io/FormShell/
  base: "/FormShell/",

  build: {
    outDir: "site-dist",
    emptyOutDir: true
  },

  resolve: {
    alias: {
      // Redirect imports from dist/ to the library source so we don't
      // need to build the library before building the site.
      [resolve(__dirname, "dist")]: resolve(__dirname, "src/formshell"),
      "@": resolve(__dirname, "src")
    }
  }
});
