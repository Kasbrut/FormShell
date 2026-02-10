/**
 * Job Application Example - Technical Interview Form with Conditional Logic
 * Demonstrates a spontaneous application form with position-specific questions
 * Questions are dynamically shown based on the selected position
 */

import { FormShell } from '../src/formshell/form-framework.js';
import type { FormConfig } from '../src/formshell/types.js';

/**
 * Job application configuration with conditional questions
 */
const jobApplicationConfig: FormConfig = {
  title: 'Technical Job Application',
  subtitle: 'Apply for a developer position',
  endpoint: '/api/applications', // Mock API in dev (see vite.config.ts); use your real API in production
  
  steps: [
    // ========================================
    // COMMON QUESTIONS (All Positions)
    // ========================================
    
    {
      id: 'name',
      type: 'text',
      label: 'What is your full name?',
      description: 'Enter your first and last name',
      required: true,
      minLength: 2,
      maxLength: 100
    },
    {
      id: 'email',
      type: 'email',
      label: 'What is your email address?',
      description: 'We\'ll send you confirmation to this address',
      required: true
    },
    {
      id: 'phone',
      type: 'text',
      label: 'Phone number (optional)',
      description: 'Include country code if international',
      required: false,
      minLength: 8,
      maxLength: 20
    },

    // Position Selection - CRITICAL for conditional logic
    {
      id: 'position',
      type: 'choice',
      label: 'Which position are you applying for?',
      description: 'Select the role that best matches your expertise',
      required: true,
      options: [
        'Frontend Developer',
        'Backend Developer',
        'Full-stack Developer',
        'DevOps Engineer'
      ]
    },

    {
      id: 'years_experience',
      type: 'number',
      label: 'How many years of professional experience do you have?',
      description: 'Count only paid professional work',
      required: true,
      min: 0,
      max: 50,
      integer: true
    },

    // ========================================
    // FRONTEND-SPECIFIC QUESTIONS
    // (shown for Frontend Developer and Full-stack Developer)
    // ========================================
    
    {
      id: 'typescript_rating',
      type: 'rating',
      label: 'Rate your TypeScript expertise',
      description: 'From 1 (beginner) to 5 (expert)',
      required: true,
      min: 1,
      max: 5,
      condition: (data) => {
        const position = data.position;
        return position === 'Frontend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'react_rating',
      type: 'rating',
      label: 'Rate your React experience',
      description: 'From 1 (beginner) to 5 (expert)',
      required: true,
      min: 1,
      max: 5,
      condition: (data) => {
        const position = data.position;
        return position === 'Frontend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'react_patterns',
      type: 'multiple-choice',
      label: 'Which React patterns/tools are you familiar with?',
      description: 'Select all that apply',
      required: true,
      options: [
        'React Hooks',
        'Context API',
        'Redux/Redux Toolkit',
        'React Query/TanStack Query',
        'Next.js',
        'Server Components'
      ],
      minChoices: 1,
      maxChoices: 6,
      condition: (data) => {
        const position = data.position;
        return position === 'Frontend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'css_frameworks',
      type: 'multiple-choice',
      label: 'Which CSS frameworks/tools do you use?',
      description: 'Select all that apply',
      required: false,
      options: [
        'Tailwind CSS',
        'Styled Components',
        'CSS Modules',
        'Sass/SCSS',
        'Material-UI',
        'Chakra UI'
      ],
      minChoices: 0,
      maxChoices: 6,
      condition: (data) => {
        const position = data.position;
        return position === 'Frontend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'frontend_build_tools',
      type: 'multiple-choice',
      label: 'Which build tools have you used?',
      description: 'Select all that apply',
      required: false,
      options: [
        'Vite',
        'Webpack',
        'Rollup',
        'esbuild',
        'Turbopack',
        'Parcel'
      ],
      minChoices: 0,
      maxChoices: 6,
      condition: (data) => {
        const position = data.position;
        return position === 'Frontend Developer' || position === 'Full-stack Developer';
      }
    },

    // ========================================
    // BACKEND-SPECIFIC QUESTIONS
    // (shown for Backend Developer and Full-stack Developer)
    // ========================================
    
    {
      id: 'nodejs_rating',
      type: 'rating',
      label: 'Rate your Node.js expertise',
      description: 'From 1 (beginner) to 5 (expert)',
      required: true,
      min: 1,
      max: 5,
      condition: (data) => {
        const position = data.position;
        return position === 'Backend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'databases',
      type: 'multiple-choice',
      label: 'Which databases have you worked with?',
      description: 'Select all that apply',
      required: true,
      options: [
        'PostgreSQL',
        'MySQL/MariaDB',
        'MongoDB',
        'Redis',
        'SQLite',
        'DynamoDB'
      ],
      minChoices: 1,
      maxChoices: 6,
      condition: (data) => {
        const position = data.position;
        return position === 'Backend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'api_design_rating',
      type: 'rating',
      label: 'Rate your REST API design knowledge',
      description: 'From 1 (beginner) to 5 (expert)',
      required: true,
      min: 1,
      max: 5,
      condition: (data) => {
        const position = data.position;
        return position === 'Backend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'backend_frameworks',
      type: 'multiple-choice',
      label: 'Which backend frameworks/tools do you know?',
      description: 'Select all that apply',
      required: false,
      options: [
        'Express.js',
        'Nest.js',
        'Fastify',
        'GraphQL (Apollo/etc)',
        'tRPC',
        'Prisma ORM'
      ],
      minChoices: 0,
      maxChoices: 6,
      condition: (data) => {
        const position = data.position;
        return position === 'Backend Developer' || position === 'Full-stack Developer';
      }
    },
    {
      id: 'api_architecture',
      type: 'multiple-choice',
      label: 'Which API architectures have you implemented?',
      description: 'Select all that apply',
      required: false,
      options: [
        'RESTful APIs',
        'GraphQL',
        'gRPC',
        'WebSockets',
        'Server-Sent Events (SSE)',
        'Microservices'
      ],
      minChoices: 0,
      maxChoices: 6,
      condition: (data) => {
        const position = data.position;
        return position === 'Backend Developer' || position === 'Full-stack Developer';
      }
    },

    // ========================================
    // DEVOPS-SPECIFIC QUESTIONS
    // (shown only for DevOps Engineer)
    // ========================================
    
    {
      id: 'cloud_platforms',
      type: 'multiple-choice',
      label: 'Which cloud platforms do you have experience with?',
      description: 'Select all that apply',
      required: true,
      options: [
        'AWS (Amazon Web Services)',
        'Azure (Microsoft)',
        'GCP (Google Cloud Platform)',
        'DigitalOcean',
        'Heroku',
        'Vercel/Netlify'
      ],
      minChoices: 1,
      maxChoices: 6,
      condition: (data) => {
        return data.position === 'DevOps Engineer';
      }
    },
    {
      id: 'container_orchestration',
      type: 'multiple-choice',
      label: 'Which container/orchestration tools do you use?',
      description: 'Select all that apply',
      required: true,
      options: [
        'Docker',
        'Kubernetes',
        'Docker Compose',
        'Docker Swarm',
        'Helm',
        'Rancher'
      ],
      minChoices: 1,
      maxChoices: 6,
      condition: (data) => {
        return data.position === 'DevOps Engineer';
      }
    },
    {
      id: 'iac_tools',
      type: 'multiple-choice',
      label: 'Which Infrastructure as Code (IaC) tools have you used?',
      description: 'Select all that apply',
      required: false,
      options: [
        'Terraform',
        'CloudFormation',
        'Ansible',
        'Pulumi',
        'Chef/Puppet',
        'ARM Templates'
      ],
      minChoices: 0,
      maxChoices: 6,
      condition: (data) => {
        return data.position === 'DevOps Engineer';
      }
    },
    {
      id: 'cicd_tools',
      type: 'multiple-choice',
      label: 'Which CI/CD tools have you worked with?',
      description: 'Select all that apply',
      required: true,
      options: [
        'GitHub Actions',
        'GitLab CI',
        'Jenkins',
        'CircleCI',
        'Travis CI',
        'Azure DevOps'
      ],
      minChoices: 1,
      maxChoices: 6,
      condition: (data) => {
        return data.position === 'DevOps Engineer';
      }
    },
    {
      id: 'monitoring_tools',
      type: 'multiple-choice',
      label: 'Which monitoring/observability tools do you know?',
      description: 'Select all that apply',
      required: false,
      options: [
        'Prometheus',
        'Grafana',
        'Datadog',
        'New Relic',
        'ELK Stack',
        'CloudWatch'
      ],
      minChoices: 0,
      maxChoices: 6,
      condition: (data) => {
        return data.position === 'DevOps Engineer';
      }
    },

    // ========================================
    // GENERAL TECHNICAL SKILLS (All Positions)
    // ========================================
    
    {
      id: 'git_rating',
      type: 'rating',
      label: 'Rate your Git workflow familiarity',
      description: 'From 1 (beginner) to 5 (expert)',
      required: true,
      min: 1,
      max: 5
    },
    {
      id: 'testing_experience',
      type: 'multiple-choice',
      label: 'What testing tools/frameworks have you used?',
      description: 'Select all that apply',
      required: false,
      options: [
        'Jest',
        'Vitest',
        'React Testing Library',
        'Cypress',
        'Playwright',
        'Mocha/Chai'
      ],
      minChoices: 0,
      maxChoices: 6
    },
    {
      id: 'agile_experience',
      type: 'yesno',
      label: 'Have you worked in Agile/Scrum teams?',
      description: 'Do you have experience with agile methodologies?',
      required: true
    },
    {
      id: 'ci_cd_experience',
      type: 'yesno',
      label: 'Have you set up or worked with CI/CD pipelines?',
      description: 'Experience with GitHub Actions, GitLab CI, Jenkins, etc.',
      required: true
    },

    // ========================================
    // WORK PREFERENCES (All Positions)
    // ========================================
    
    {
      id: 'remote_preference',
      type: 'choice',
      label: 'What is your work location preference?',
      required: true,
      options: [
        'Fully Remote',
        'Hybrid (2-3 days in office)',
        'On-site (full time in office)',
        'Flexible/No preference'
      ]
    },
    {
      id: 'availability',
      type: 'choice',
      label: 'When are you available to start?',
      required: true,
      options: [
        'Immediately',
        'Within 2 weeks',
        '1 month notice',
        '2-3 months notice',
        'Just exploring opportunities'
      ]
    },

    // ========================================
    // PORTFOLIO AND ADDITIONAL INFO (All Positions)
    // ========================================
    
    {
      id: 'portfolio_url',
      type: 'url',
      label: 'Portfolio or GitHub URL (optional)',
      description: 'Share your work with us',
      required: false
    },
    {
      id: 'linkedin_url',
      type: 'url',
      label: 'LinkedIn profile URL (optional)',
      required: false
    },
    {
      id: 'salary_expectation',
      type: 'number',
      label: 'Salary expectation (annual, in USD - optional)',
      description: 'This helps us ensure we can meet your expectations',
      required: false,
      min: 0,
      max: 1000000
    },
    {
      id: 'additional_notes',
      type: 'text',
      label: 'Anything else you\'d like us to know?',
      description: 'Projects you\'re proud of, special skills, etc.',
      required: false,
      maxLength: 500
    },
    {
      id: 'privacy_consent',
      type: 'yesno',
      label: 'Do you consent to our privacy policy?',
      description: 'We need your consent to process your application',
      required: true
    }
  ],
  
  // Callback when application is completed and submitted
  onComplete: (data) => {
    console.log('%c✓ Application submitted successfully! We\'ll review your profile and get back to you soon.', 
      'color: #10b981; font-size: 14px; font-weight: bold;');
    
    // Display position-specific summary
    const position = data.position;
    console.log(`%cPosition: ${position}`, 'color: #6366f1; font-size: 13px; font-weight: bold;');
    
    // Calculate average rating for relevant skills
    const ratings: number[] = [];
    
    if (position === 'Frontend Developer' || position === 'Full-stack Developer') {
      if (typeof data.typescript_rating === 'number') ratings.push(data.typescript_rating);
      if (typeof data.react_rating === 'number') ratings.push(data.react_rating);
    }
    
    if (position === 'Backend Developer' || position === 'Full-stack Developer') {
      if (typeof data.nodejs_rating === 'number') ratings.push(data.nodejs_rating);
      if (typeof data.api_design_rating === 'number') ratings.push(data.api_design_rating);
    }
    
    // Always include git rating
    if (typeof data.git_rating === 'number') ratings.push(data.git_rating);
    
    if (ratings.length > 0) {
      const avgRating = (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1);
      console.log(`%cAverage Technical Rating: ${'★'.repeat(Math.round(Number(avgRating)))} (${avgRating}/5)`,
        'color: #f59e0b; font-size: 13px;');
    }
    
    // Display key skills summary
    console.log('');
    console.log('%cKey Skills:', 'color: #8b5cf6; font-size: 12px; font-weight: bold;');
    
    if (position === 'Frontend Developer' || position === 'Full-stack Developer') {
      console.log(`%c  Frontend: TypeScript (${data.typescript_rating}/5), React (${data.react_rating}/5)`,
        'color: #cbd5e1; font-size: 11px;');
    }
    
    if (position === 'Backend Developer' || position === 'Full-stack Developer') {
      console.log(`%c  Backend: Node.js (${data.nodejs_rating}/5), API Design (${data.api_design_rating}/5)`,
        'color: #cbd5e1; font-size: 11px;');
    }
    
    if (position === 'DevOps Engineer') {
      const cloudCount = Array.isArray(data.cloud_platforms) ? data.cloud_platforms.length : 0;
      const containerCount = Array.isArray(data.container_orchestration) ? data.container_orchestration.length : 0;
      console.log(`%c  DevOps: ${cloudCount} cloud platforms, ${containerCount} container tools`,
        'color: #cbd5e1; font-size: 11px;');
    }
  }
};

/**
 * Create and initialize the job application form
 */
const form = new FormShell(jobApplicationConfig);
window.formShell = form;

// Loading message
console.log('%c✓ Job application form loaded', 'color: #10b981; font-size: 14px; font-weight: bold;');
console.log('%c  Type formShell.help() for commands or formShell.start() to begin', 'color: #94a3b8; font-size: 12px;');
console.log('');
console.log('%c💡 This form adapts to your selected position!', 'color: #ec4899; font-size: 12px; font-weight: bold;');
console.log('%c  Frontend devs: React, TypeScript, CSS questions', 'color: #94a3b8; font-size: 11px;');
console.log('%c  Backend devs: Node.js, databases, API questions', 'color: #94a3b8; font-size: 11px;');
console.log('%c  Full-stack devs: Both frontend & backend questions', 'color: #94a3b8; font-size: 11px;');
console.log('%c  DevOps: Cloud, containers, infrastructure questions', 'color: #94a3b8; font-size: 11px;');

// Export for use as module (if needed)
export { jobApplicationConfig };
export default form;
