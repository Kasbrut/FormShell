/**
 * FormShell Theme - Elegant Design System
 * Color palette, Unicode icons, box styles for elegant console rendering
 */

// Type definitions for the theme
interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  text: {
    primary: string;
    secondary: string;
    muted: string;
    dark: string;
  };
  background: {
    main: string;
    secondary: string;
    accent: string;
  };
}

interface Icons {
  checkmark: string;
  cross: string;
  star: string;
  starEmpty: string;
  arrow: string;
  bullet: string;
  bulletEmpty: string;
  chevron: string;
  heart: string;
  info: string;
  warning: string;
  question: string;
  cursor: string;
  cursorBlink: string;
  spinner: string[];
}

interface BoxCharacters {
  // Single lines
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
  // Double lines (for emphasis)
  doubleTopLeft: string;
  doubleTopRight: string;
  doubleBottomLeft: string;
  doubleBottomRight: string;
  doubleHorizontal: string;
  doubleVertical: string;
  // Progress bar characters
  filled: string;
  empty: string;
  halfFilled: string;
  // Shadow/gradient characters
  shadow: string[];
  fade: string[];
}

interface TextFormatters {
  bold: (text: string) => string;
  italic: (text: string) => string;
  underline: (text: string) => string;
  boldUnicode: (text: string) => string;
}

interface StylePreset {
  [key: string]: string | undefined;
  color: string;
  fontSize: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  textShadow?: string;
}

interface StylePresets {
  title: StylePreset;
  subtitle: StylePreset;
  body: StylePreset;
  success: StylePreset;
  error: StylePreset;
  muted: StylePreset;
  highlight: StylePreset;
}

interface FormatFunctions {
  title: (text: string) => [string, string];
  subtitle: (text: string) => [string, string];
  body: (text: string) => [string, string];
  success: (text: string) => [string, string];
  error: (text: string) => [string, string];
  muted: (text: string) => [string, string];
  highlight: (text: string) => [string, string];
  colored: (text: string, color: string) => [string, string];
}

interface ThemeType {
  colors: ColorPalette;
  icons: Icons;
  box: BoxCharacters;
  text: TextFormatters;
  styles: StylePresets;
  createStyle: (styleObj: Record<string, string | undefined>) => string;
  format: FormatFunctions;
}

export const Theme: ThemeType = {
  // Main color palette (CSS styling for console.log)
  colors: {
    primary: '#6366f1',      // Indigo
    secondary: '#8b5cf6',    // Purple
    accent: '#ec4899',       // Pink
    success: '#10b981',      // Green
    error: '#ef4444',        // Red
    warning: '#f59e0b',      // Orange
    info: '#3b82f6',         // Blue
    
    text: {
      primary: '#f8fafc',    // Almost pure white
      secondary: '#cbd5e1',  // Light gray
      muted: '#64748b',      // Medium gray
      dark: '#1e293b'        // Dark gray for background
    },
    
    background: {
      main: '#0f172a',       // Dark blue
      secondary: '#1e293b',  // Lighter dark blue
      accent: '#334155'      // Blue gray
    }
  },

  // Unicode icons for UI elements
  icons: {
    checkmark: '✓',
    cross: '✗',
    star: '★',
    starEmpty: '☆',
    arrow: '➤',
    bullet: '◆',
    bulletEmpty: '◇',
    chevron: '▸',
    heart: '♥',
    info: 'ℹ',
    warning: '⚠',
    question: '?',
    cursor: '█',
    cursorBlink: '▊',
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  },

  // Box drawing characters (Unicode)
  box: {
    // Single lines
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    
    // Double lines (for emphasis)
    doubleTopLeft: '╔',
    doubleTopRight: '╗',
    doubleBottomLeft: '╚',
    doubleBottomRight: '╝',
    doubleHorizontal: '═',
    doubleVertical: '║',
    
    // Progress bar characters
    filled: '▓',
    empty: '░',
    halfFilled: '▒',
    
    // Shadow/gradient characters
    shadow: ['░', '▒', '▓'],
    fade: ['⣀', '⣄', '⣤', '⣦', '⣶', '⣷', '⣿']
  },

  // Text styles (using Unicode characters or ANSI)
  text: {
    bold: (text: string): string => `\x1b[1m${text}\x1b[0m`,
    italic: (text: string): string => `\x1b[3m${text}\x1b[0m`,
    underline: (text: string): string => `\x1b[4m${text}\x1b[0m`,
    
    // Alternative using Unicode mathematical characters (fallback)
    boldUnicode: (text: string): string => {
      const bold: Record<string, string> = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 
        'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
        'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
        'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
        'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
        'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱',
        '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
      };
      return text.split('').map(char => bold[char] || char).join('');
    }
  },

  // Style presets for common elements
  styles: {
    title: {
      color: '#6366f1',
      fontSize: '20px',
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
    },
    
    subtitle: {
      color: '#8b5cf6',
      fontSize: '16px',
      fontWeight: '600'
    },
    
    body: {
      color: '#f8fafc',
      fontSize: '14px',
      lineHeight: '1.5'
    },
    
    success: {
      color: '#10b981',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    
    error: {
      color: '#ef4444',
      fontSize: '14px',
      fontWeight: 'bold'
    },
    
    muted: {
      color: '#64748b',
      fontSize: '13px',
      fontStyle: 'italic'
    },
    
    highlight: {
      color: '#ec4899',
      fontSize: '14px',
      fontWeight: 'bold',
      textShadow: '0 0 8px rgba(236, 72, 153, 0.4)'
    }
  },

  // Helper to create CSS style string for console.log
  createStyle: (styleObj: Record<string, string | undefined>): string => {
    return Object.entries(styleObj)
      .filter((entry): entry is [string, string] => entry[1] !== undefined)
      .map(([key, value]) => {
        // Convert camelCase to kebab-case
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  },

  // Preset messages with styles
  format: {
    title: (text: string): [string, string] => 
      [`%c${text}`, Theme.createStyle(Theme.styles.title)],
    subtitle: (text: string): [string, string] => 
      [`%c${text}`, Theme.createStyle(Theme.styles.subtitle)],
    body: (text: string): [string, string] => 
      [`%c${text}`, Theme.createStyle(Theme.styles.body)],
    success: (text: string): [string, string] => 
      [`%c${Theme.icons.checkmark} ${text}`, Theme.createStyle(Theme.styles.success)],
    error: (text: string): [string, string] => 
      [`%c${Theme.icons.cross} ${text}`, Theme.createStyle(Theme.styles.error)],
    muted: (text: string): [string, string] => 
      [`%c${text}`, Theme.createStyle(Theme.styles.muted)],
    highlight: (text: string): [string, string] => 
      [`%c${text}`, Theme.createStyle(Theme.styles.highlight)],
    
    // Quick custom colors
    colored: (text: string, color: string): [string, string] => 
      [`%c${text}`, `color: ${color}; font-size: 14px;`]
  }
};
