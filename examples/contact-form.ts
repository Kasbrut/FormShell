/**
 * Contact Form Example
 * Complete implementation using FormShell
 */

import { FormShell } from '../dist/index.js';
import type { FormConfig } from '../dist/index.js';

/**
 * Contact form configuration
 */
const contactFormConfig: FormConfig = {
  title: 'Contact Form',
  subtitle: 'Fill out the form to request information',
  endpoint: '/api/contact', // Mock API in dev (see vite.config.ts); use your real API in production
  
  steps: [
    {
      id: 'name',
      type: 'text',
      label: 'What is your name?',
      description: 'Enter your full name',
      required: true,
      minLength: 2,
      maxLength: 100
    },
    {
      id: 'email',
      type: 'email',
      label: 'What is your email address?',
      description: 'We\'ll send confirmation to this address',
      required: true
    },
    {
      id: 'phone',
      type: 'text',
      label: 'Phone number (optional)',
      description: 'Enter your number if you want to be contacted',
      required: false,
      minLength: 8,
      maxLength: 20
    },
    {
      id: 'service',
      type: 'choice',
      label: 'Which service are you interested in?',
      description: 'Choose the service you want more information about',
      required: true,
      options: [
        'Web Development Consulting',
        'Mobile App Development',
        'UI/UX Design',
        'SEO and Digital Marketing',
        'Other'
      ]
    },
    {
      id: 'budget',
      type: 'choice',
      label: 'What is your indicative budget?',
      required: false,
      options: [
        'Less than $5,000',
        '$5,000 - $10,000',
        '$10,000 - $25,000',
        '$25,000 - $50,000',
        'Over $50,000'
      ]
    },
    {
      id: 'urgency',
      type: 'choice',
      label: 'When would you like to start the project?',
      required: true,
      options: [
        'Immediately (within 1 month)',
        'Soon (1-3 months)',
        'In a few months (3-6 months)',
        'I\'m just exploring options'
      ]
    },
    {
      id: 'satisfaction',
      type: 'rating',
      label: 'How easy was filling out this form?',
      description: 'From 1 (difficult) to 5 (very easy)',
      required: false,
      min: 1,
      max: 5
    },
    {
      id: 'message',
      type: 'text',
      label: 'Would you like to add any other details?',
      description: 'Any additional information you think is useful',
      required: false,
      maxLength: 500
    },
    {
      id: 'newsletter',
      type: 'yesno',
      label: 'Do you want to subscribe to our newsletter?',
      description: 'You\'ll receive updates and exclusive offers',
      required: true,
      defaultValue: false
    },
    {
      id: 'consent',
      type: 'yesno',
      label: 'Do you accept the terms and conditions?',
      description: 'You must accept the privacy policy to proceed',
      required: true
    }
  ],
  
  // Callback when the form is completed and submitted
  onComplete: () => {
    console.log('%c✓ Thank you! We will get back to you soon.', 
      'color: #10b981; font-size: 14px; font-weight: bold;');
  }
};

/**
 * Create and initialize the form
 */
const form = new FormShell(contactFormConfig);
window.formShell = form;

// Loading message
console.log('%c✓ Form loaded', 'color: #10b981; font-size: 14px; font-weight: bold;');

// Export for use as module (if needed)
export { contactFormConfig };
export default form;
