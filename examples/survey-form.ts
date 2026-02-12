/**
 * Survey Example - Satisfaction Questionnaire
 * Form with multiple choice, rating, and various question types
 */

import { FormShell } from '../dist/index.js';
import type { FormConfig } from '../dist/index.js';

/**
 * Satisfaction survey configuration
 */
const surveyFormConfig: FormConfig = {
  title: 'Satisfaction Survey',
  subtitle: 'Help us improve our services',
  endpoint: '/api/survey', // Mock API in dev (see vite.config.ts); use your real API in production
  
  steps: [
    {
      id: 'user_type',
      type: 'choice',
      label: 'How did you hear about us?',
      required: true,
      options: [
        'Search engine (Google, Bing, etc.)',
        'Social media (Facebook, Instagram, LinkedIn)',
        'Friend recommendation',
        'Online advertising',
        'Article or blog',
        'Other'
      ]
    },
    {
      id: 'frequency',
      type: 'choice',
      label: 'How often do you use our service?',
      required: true,
      options: [
        'Daily',
        'Several times a week',
        '1-2 times a week',
        'A few times a month',
        'Rarely',
        'This is my first time'
      ]
    },
    {
      id: 'features_used',
      type: 'multiple-choice',
      label: 'Which features do you use most?',
      description: 'You can select multiple options',
      required: true,
      options: [
        'Main dashboard',
        'Reports and analytics',
        'Project management',
        'Team collaboration',
        'Integrations',
        'API'
      ],
      minChoices: 1,
      maxChoices: 6
    },
    {
      id: 'overall_satisfaction',
      type: 'rating',
      label: 'Overall satisfaction',
      description: 'How satisfied are you with our service?',
      required: true,
      min: 1,
      max: 5
    },
    {
      id: 'ease_of_use',
      type: 'rating',
      label: 'Ease of use',
      description: 'How easy is our platform to use?',
      required: true,
      min: 1,
      max: 5
    },
    {
      id: 'performance',
      type: 'rating',
      label: 'Performance and speed',
      description: 'How do you rate the platform\'s performance?',
      required: true,
      min: 1,
      max: 5
    },
    {
      id: 'customer_support',
      type: 'rating',
      label: 'Customer support',
      description: 'How do you rate the quality of our support?',
      required: false,
      min: 1,
      max: 5
    },
    {
      id: 'value_for_money',
      type: 'rating',
      label: 'Value for money',
      description: 'Is the service worth the price you pay?',
      required: true,
      min: 1,
      max: 5
    },
    {
      id: 'most_valuable_feature',
      type: 'text',
      label: 'What feature do you appreciate the most?',
      description: 'Briefly describe',
      required: false,
      maxLength: 200
    },
    {
      id: 'improvements',
      type: 'text',
      label: 'What would you improve?',
      description: 'Suggestions for improving the service',
      required: false,
      maxLength: 300
    },
    {
      id: 'missing_features',
      type: 'text',
      label: 'Are there any missing features?',
      description: 'What would you like to see implemented?',
      required: false,
      maxLength: 300
    },
    {
      id: 'recommend',
      type: 'yesno',
      label: 'Would you recommend our service to a friend?',
      required: true
    },
    {
      id: 'follow_up',
      type: 'yesno',
      label: 'Can we contact you to discuss your answers further?',
      description: 'If yes, we\'ll reach out via email',
      required: false
    }
  ],
  
  // Callback when the survey is completed
  onComplete: (data) => {
    // Calculate average satisfaction
    const ratings = [
      data.overall_satisfaction,
      data.ease_of_use,
      data.performance,
      data.value_for_money
    ].filter((r): r is number => r !== null && typeof r === 'number');
    
    if (typeof data.customer_support === 'number') ratings.push(data.customer_support);
    
    const avgRating = (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1);
    
    console.log('%c✓ Thank you! Average rating: ' + '★'.repeat(Math.round(Number(avgRating))) + ' (' + avgRating + '/5)',
      'color: #10b981; font-size: 14px; font-weight: bold;');
  }
};

/**
 * Create and initialize the survey
 */
const form = new FormShell(surveyFormConfig);
window.formShell = form;

// Loading message
console.log('%c✓ Survey loaded', 'color: #10b981; font-size: 14px; font-weight: bold;');

// Export for use as module (if needed)
export { surveyFormConfig };
export default form;
