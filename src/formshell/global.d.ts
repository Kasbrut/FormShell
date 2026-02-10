/**
 * Global TypeScript declarations for FormShell
 * 
 * This file provides type definitions for the global `formShell` object
 * attached to the window for console interaction.
 * 
 * @example
 * // Access formShell in the console with full type support
 * formShell.start()
 * formShell.answer("response")
 * formShell.submit()
 */

import type { FormShell } from './index';

declare global {
  interface Window {
    /**
     * Global FormShell instance for console interaction
     * Automatically assigned by the library for development and testing
     */
    formShell: FormShell;
  }
}

export {};
