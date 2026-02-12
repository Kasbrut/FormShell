# FormShell

An elegant framework for creating interactive multi-step forms directly in the browser console.

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Firefox%20%7C%20Safari-orange.svg)

## Features

- **Multi-Step Forms**: One-question-at-a-time flow
- **Built-in Validation**: Validation for every field type
- **Conditional Logic**: Show/hide steps based on previous answers
- **Progress Tracking**: Progress bar, step counter, and estimated time
- **Non-blocking Help**: Call `formShell.help()` at any time without losing your place
- **Zero Dependencies**: No external libraries required
- **Endpoint Ready**: POST JSON to custom endpoints with response handling
- **TypeScript**: Full type definitions included
- **Vite**: Modern dev server and build tool

---

## Quick Start

### 1. Installation

```bash
pnpm install formshell
```

Or clone and install locally:

```bash
git clone <repository-url>
cd formshell
pnpm install
```

### 2. Development

```bash
pnpm dev
```

Then open your browser and navigate to `http://localhost:5173`.

### 3. Build

```bash
pnpm build
```

---

## Step-by-Step Guide

This section walks through the entire flow, from configuration to API response.

### Step 1 -- Create a FormConfig

A `FormConfig` object defines everything about your form. Here is the full interface with every available option:

```typescript
import { FormShell } from 'formshell';
import type { FormConfig, FormData } from 'formshell';

const config: FormConfig = {
  // (required) The form title, displayed on the welcome and help screens
  title: 'Feedback Form',

  // (optional) A subtitle shown below the title
  subtitle: 'We value your opinion',

  // (optional) POST endpoint -- when set, formShell.submit() sends data here
  endpoint: '/api/feedback',

  // (required) Array of field configurations (see "Supported Field Types" below)
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
      label: 'Your email address?',
      required: true
    },
    {
      id: 'rating',
      type: 'rating',
      label: 'How satisfied are you?',
      required: true,
      min: 1,
      max: 5
    },
    {
      id: 'subscribe',
      type: 'yesno',
      label: 'Subscribe to our newsletter?',
      required: false,
      defaultValue: false
    }
  ],

  // (optional) Called after successful submission
  // When an endpoint is set, `data` contains the server's JSON response.
  // When no endpoint is set, `data` contains the collected form answers.
  onComplete: (data: FormData) => {
    console.log('Received:', data);
  }
};
```

### Step 2 -- Instantiate FormShell

```typescript
const form = new FormShell(config);
```

> **TypeScript autocomplete:** FormShell includes global type definitions for `window.formShell`. 
> 
> To enable them in your TypeScript project, reference the global declarations at the top of your main file:
> 
> ```typescript
> /// <reference types="formshell/global" />
> 
> // Now window.formShell has full type support!
> const form = new FormShell(config);
> ```
>
> If you want to use a **custom name** for your brand instead of `formShell`:
>
> ```typescript
> // global.d.ts in your project root
> import type { FormShell } from 'formshell';
> 
> declare global {
>   interface Window {
>     myBrandName: FormShell;  // Use your custom name
>   }
> }
> 
> export {};
> ```
>
> Then assign it manually:
> ```typescript
> const form = new FormShell(config);
> window.myBrandName = form;
> ```

### Step 3 -- Include in HTML

```html
<script type="module" src="./my-form.ts"></script>
```

That is all. The form renders entirely inside the browser console -- no visible UI is needed.

### Step 4 -- Open the Console

- **Chrome/Edge**: `F12` or `Ctrl+Shift+J` (`Cmd+Option+J` on Mac)
- **Firefox**: `F12` or `Ctrl+Shift+K` (`Cmd+Option+K` on Mac)
- **Safari**: Enable Developer menu, then `Cmd+Option+C`

When the page loads you will see:

```
  Feedback Form
  We value your opinion

  Type formShell.start() to begin or formShell.help() for available commands
```

### Step 5 -- Interact with the Form

```javascript
// Show all available commands (non-blocking, does not interrupt the form)
formShell.help()

// Start the form
formShell.start()

// Answer questions
formShell.answer("John Doe")
formShell.answer("john@example.com")
formShell.answer(4)          // rating
formShell.y()                // yes/no shortcut

// Navigate
formShell.back()             // go to previous question
formShell.skip()             // skip optional question

// After the last answer the summary screen appears
formShell.submit()           // send data to the endpoint (or log it)

// At any point
formShell.help()             // show commands -- does NOT lose your progress
formShell.continue()         // resume where you left off after help
formShell.reset()            // start over from scratch
```

### Step 6 -- What Happens on Submit

When `formShell.submit()` is called:

1. **With an endpoint** -- a `POST` request is sent:

   ```
   POST /api/feedback
   Content-Type: application/json

   {
     "name": "John Doe",
     "email": "john@example.com",
     "rating": 4,
     "subscribe": true
   }
   ```

   The server's JSON response is passed to `onComplete(response)` and printed in the console:

   ```
   Response: { success: true, feedbackId: "fb-1707562800000", ... }
   ```

2. **Without an endpoint** -- the collected data is passed directly to `onComplete(data)` and printed:

   ```
   Data: { name: "John Doe", email: "john@example.com", rating: 4, subscribe: true }
   ```

---

## Supported Field Types

### Text Field

Free text with length and pattern validation.

```typescript
{
  id: 'name',
  type: 'text',
  label: 'What is your name?',
  description: 'Optional help text',
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[A-Za-z\s]+$/   // optional regex
}
```

### Number Field

Numbers with range and integer validation.

```typescript
{
  id: 'age',
  type: 'number',
  label: 'How old are you?',
  required: true,
  min: 18,
  max: 120,
  integer: true
}
```

### Email Field

Email with automatic pattern validation.

```typescript
{
  id: 'email',
  type: 'email',
  label: 'What is your email?',
  required: true
}
```

### URL Field

URL with http/https format validation.

```typescript
{
  id: 'website',
  type: 'url',
  label: 'Your website address?',
  required: false
}
```

### Date Field

Date in DD/MM/YYYY format with validation.

```typescript
{
  id: 'birthdate',
  type: 'date',
  label: 'Date of birth?',
  required: true
}
```

### Choice Field

Single choice from a list of options.

```typescript
{
  id: 'service',
  type: 'choice',
  label: 'Which service are you interested in?',
  required: true,
  options: [
    'Web Development',
    'Mobile App',
    'UI/UX Design',
    'Consulting'
  ]
}
// Answer: formShell.answer(2) selects "Mobile App"
```

Options can also use `{ value, label }` objects:

```typescript
options: [
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile App' }
]
```

### Multiple Choice Field

Multiple selections from a list.

```typescript
{
  id: 'interests',
  type: 'multiple-choice',
  label: 'Which technologies do you use?',
  required: true,
  options: ['JavaScript', 'Python', 'Java', 'Go', 'Rust'],
  minChoices: 1,
  maxChoices: 3
}
// Answer: formShell.answer("1,3,5") selects JavaScript, Java, Rust
```

### Rating Field

Numeric scale with star visualization.

```typescript
{
  id: 'satisfaction',
  type: 'rating',
  label: 'How satisfied are you?',
  required: true,
  min: 1,
  max: 5
}
// Answer: formShell.answer(4)
```

### Yes/No Field

Binary Yes/No question.

```typescript
{
  id: 'newsletter',
  type: 'yesno',
  label: 'Subscribe to newsletter?',
  required: true,
  defaultValue: false
}
// Answer: formShell.y() or formShell.n()
```

---

## Conditional Logic

Steps can be shown or hidden based on previous answers using the `condition` callback:

```typescript
{
  id: 'react_rating',
  type: 'rating',
  label: 'Rate your React experience',
  required: true,
  min: 1,
  max: 5,
  condition: (data) => {
    return data.position === 'Frontend Developer'
        || data.position === 'Full-stack Developer';
  }
}
```

When a step's `condition` returns `false`, it is skipped during navigation, excluded from the progress bar, and hidden in the summary.

See `examples/job-application.ts` for a complete conditional-logic example.

---

## Commands Reference

| Command | Description |
|---------|-------------|
| `formShell.start()` | Start the form from the welcome screen |
| `formShell.help()` | Show all commands (can be called at any time) |
| `formShell.continue()` | Resume the form after viewing help |
| `formShell.answer(value)` | Answer the current question and proceed |
| `formShell.y()` / `formShell.n()` | Shortcut for yes/no questions |
| `formShell.skip()` | Skip the current question (if optional) |
| `formShell.back()` | Go to the previous question |
| `formShell.submit()` | Submit data to the endpoint (after completing all steps) |
| `formShell.reset()` | Start over from scratch |
| `formShell.destroy()` | Cleanup and destroy the instance |

---

## Customization

### Modify the Theme

Customize colors and styles by editing `src/formshell/theme.ts`:

```typescript
export const Theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    success: '#10b981',
    error: '#ef4444',
    // ...
  }
};
```

---

## Project Structure

```
formshell/
├── src/
│   └── formshell/
│       ├── types.ts              # TypeScript type definitions
│       ├── theme.ts              # Design system (colors, icons, styles)
│       ├── tui-renderer.ts       # Console rendering engine
│       ├── field-types.ts        # Field types and validators
│       ├── form-framework.ts     # Core framework (FormShell class)
│       └── index.ts              # Main entry point and exports
├── examples/
│   ├── contact-form.ts           # Contact form example
│   ├── survey-form.ts            # Satisfaction survey example
│   └── job-application.ts        # Job application with conditional logic
├── dist/                         # Build output
│   ├── index.js                  # ESM bundle
│   └── index.d.ts                # Type definitions
├── vite.config.ts                # Vite config (includes mock API endpoints)
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Package configuration
├── index.html                    # Demo page
└── README.md                     # This documentation
```

---

## API Reference

### FormShell

#### Constructor

```typescript
new FormShell(config: FormConfig)
```

**FormConfig:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | `string` | yes | Form title shown on welcome/help screens |
| `subtitle` | `string` | no | Subtitle shown below the title |
| `endpoint` | `string` | no | POST endpoint for `formShell.submit()` |
| `steps` | `FieldConfig[]` | yes | Array of field configurations |
| `onComplete` | `(data: FormData) => void \| Promise<void>` | no | Callback after successful submission |

#### Public Methods

| Method | Return | Description |
|--------|--------|-------------|
| `start()` | `void` | Start the form |
| `help()` | `void` | Show help (non-blocking) |
| `continue()` | `void` | Resume after help |
| `answer(value)` | `void` | Answer current question |
| `y()` / `n()` | `void` | Yes/No shortcuts |
| `skip()` | `void` | Skip optional question |
| `back()` | `void` | Go to previous question |
| `submit()` | `Promise<void>` | Submit data |
| `reset()` | `void` | Start over |
| `destroy()` | `void` | Cleanup instance |
| `getProgress()` | `ProgressInfo` | Get current progress |
| `getEstimatedTime()` | `string \| null` | Estimated remaining time |

---

## Data Submission

### POST to Endpoint

```typescript
const form = new FormShell({
  title: 'My Form',
  endpoint: 'https://api.yoursite.com/submit',
  steps: [/* ... */],
  onComplete: (serverResponse) => {
    // serverResponse is the parsed JSON from the endpoint
    console.log('Server says:', serverResponse);
  }
});
```

When `formShell.submit()` is called, FormShell sends:

```
POST https://api.yoursite.com/submit
Content-Type: application/json
Body: { "field_id_1": "value1", "field_id_2": "value2", ... }
```

### Without Endpoint

```typescript
const form = new FormShell({
  title: 'My Form',
  steps: [/* ... */],
  onComplete: (collectedData) => {
    // collectedData is a plain object with all answers
    console.log('Collected:', collectedData);
  }
});
```

### JSON Data Format

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "service": "Web Development",
  "rating": 5,
  "newsletter": true,
  "technologies": ["JavaScript", "Python"]
}
```

---

## Complete Examples

### Contact Form

See `examples/contact-form.ts` -- a complete contact form with:
- Name (text, required), Email (email, required), Phone (text, optional)
- Service selection (choice), Budget (choice), Urgency (choice)
- Satisfaction rating (rating), Message (text, optional)
- Newsletter (yes/no), Privacy consent (yes/no)

### Satisfaction Survey

See `examples/survey-form.ts` -- a questionnaire with:
- Single and multiple choice questions
- Multiple rating scales
- Text feedback fields
- Automatic average rating calculation

### Job Application (Conditional Logic)

See `examples/job-application.ts` -- a technical interview form with:
- Position selection drives which questions appear
- Frontend-specific questions (TypeScript, React, CSS frameworks)
- Backend-specific questions (Node.js, databases, API design)
- DevOps-specific questions (cloud, containers, CI/CD)
- Full-stack candidates see both frontend and backend sections

---

## Validation

Each field type has built-in validation:

- **Required**: Mandatory field
- **Min/Max Length**: For text fields
- **Min/Max Value**: For number and rating fields
- **Pattern**: Regex for email, URL, date
- **Options**: Valid choices for choice/multiple-choice

Error messages are clear and contextual:

```javascript
formShell.answer("ab")       // minLength: 3  -> "Minimum 3 characters required"
formShell.answer("bad-email") //              -> "Invalid email address"
formShell.answer(10)          // 5 options    -> "Choose a number between 1 and 5"
```

---

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 88+ | Full support |
| Firefox | 85+ | Full support |
| Safari | 14+ | Full support |
| Edge | 88+ | Full support |

**Requirements:**
- ES6 Modules support
- `console.log` CSS styling support
- Active JavaScript console

---

## Troubleshooting

### Form does not appear
- Make sure you have opened the Browser Console
- Check for JavaScript errors in the console
- Verify files are served via HTTP(S), not `file://`

### Colors do not show
- Some browsers may not support console styling
- Check browser console settings

### Endpoint does not receive data
- Check CORS configuration on the server
- Verify the endpoint accepts `POST` with `Content-Type: application/json`
- Inspect the Network tab for request details

---

## License

MIT License -- Feel free to use this framework in your projects!

## Contributing

Contributions, issues, and feature requests are welcome!
