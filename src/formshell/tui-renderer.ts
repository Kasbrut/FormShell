/**
 * FormShell TUI Renderer
 * Handles elegant rendering in the browser console
 * Includes blinking cursor, animations, Unicode boxes, and CSS styling
 */

import { Theme } from './theme.js';

// ANSI escape character (ESC) used in terminal color codes
const ANSI_ESC = '\x1b';

interface ProgressBarResult {
  bar: string;
  percentage: number;
  text: string;
}

export class TUIRenderer {
  private cursorVisible: boolean;
  private cursorInterval: number | null;

  constructor() {
    this.cursorVisible = true;
    this.cursorInterval = null;
  }

  /**
   * Initialize the renderer and start cursor blinking
   */
  init(): void {
    this.startCursorBlink();
  }

  /**
   * Clear the console
   */
  clear(): void {
    console.clear();
  }

  /**
   * Start the cursor blinking animation
   */
  startCursorBlink(): void {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }
    
    this.cursorInterval = window.setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
    }, 530); // Standard blink speed
  }

  /**
   * Stop the cursor animation
   */
  stopCursorBlink(): void {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }
  }

  /**
   * Get the current cursor character
   */
  getCursor(): string {
    return this.cursorVisible ? Theme.icons.cursor : ' ';
  }

  /**
   * Create a decorative horizontal line
   */
  createHorizontalLine(width: number = 60, char: string = Theme.box.horizontal): string {
    return char.repeat(width);
  }

  /**
   * Create a box with Unicode borders
   */
  createBox(content: string | string[], width: number = 60, style: 'single' | 'double' = 'single'): string[] {
    const lines: string[] = [];
    const useDouble = style === 'double';
    
    const topLeft = useDouble ? Theme.box.doubleTopLeft : Theme.box.topLeft;
    const topRight = useDouble ? Theme.box.doubleTopRight : Theme.box.topRight;
    const bottomLeft = useDouble ? Theme.box.doubleBottomLeft : Theme.box.bottomLeft;
    const bottomRight = useDouble ? Theme.box.doubleBottomRight : Theme.box.bottomRight;
    const horizontal = useDouble ? Theme.box.doubleHorizontal : Theme.box.horizontal;
    const vertical = useDouble ? Theme.box.doubleVertical : Theme.box.vertical;
    
    // Top border
    lines.push(topLeft + horizontal.repeat(width - 2) + topRight);
    
    // Content lines
    const contentLines = Array.isArray(content) ? content : [content];
    contentLines.forEach(line => {
      const lineStr = String(line);
      // Remove ANSI style characters to calculate correct length
      // Remove ANSI escape codes (ESC[...m pattern) - ESC character is \x1b (ASCII 27)
      const ansiEscapePattern = new RegExp(`${ANSI_ESC}\\[[0-9;]*m`, 'g');
      const plainText = lineStr.replace(ansiEscapePattern, '');
      const padding = width - 2 - plainText.length;
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      
      lines.push(vertical + ' '.repeat(leftPad) + lineStr + ' '.repeat(rightPad) + vertical);
    });
    
    // Bottom border
    lines.push(bottomLeft + horizontal.repeat(width - 2) + bottomRight);
    
    return lines;
  }

  /**
   * Create an elegant progress bar
   */
  createProgressBar(current: number, total: number, width: number = 40): ProgressBarResult {
    const percentage = Math.round((current / total) * 100);
    const filledWidth = Math.round((current / total) * width);
    const emptyWidth = width - filledWidth;
    
    const filled = Theme.box.filled.repeat(filledWidth);
    const empty = Theme.box.empty.repeat(emptyWidth);
    
    return {
      bar: filled + empty,
      percentage: percentage,
      text: `${current}/${total}`
    };
  }

  /**
   * Render the main title with style
   */
  renderTitle(title: string): void {
    const [format, style] = Theme.format.title(title);
    console.log(format, style);
  }

  /**
   * Render the subtitle with style
   */
  renderSubtitle(subtitle: string): void {
    const [format, style] = Theme.format.subtitle(subtitle);
    console.log(format, style);
  }

  /**
   * Render normal text
   */
  renderText(text: string, color: string | null = null): void {
    if (color) {
      const [format, style] = Theme.format.colored(text, color);
      console.log(format, style);
    } else {
      const [format, style] = Theme.format.body(text);
      console.log(format, style);
    }
  }

  /**
   * Render a success message
   */
  renderSuccess(message: string): void {
    const [format, style] = Theme.format.success(message);
    console.log(format, style);
  }

  /**
   * Render an error message
   */
  renderError(message: string): void {
    const [format, style] = Theme.format.error(message);
    console.log(format, style);
  }

  /**
   * Render muted/secondary text
   */
  renderMuted(text: string): void {
    const [format, style] = Theme.format.muted(text);
    console.log(format, style);
  }

  /**
   * Render highlighted text
   */
  renderHighlight(text: string): void {
    const [format, style] = Theme.format.highlight(text);
    console.log(format, style);
  }

  /**
   * Render a complete box
   */
  renderBox(content: string | string[], width: number = 60, style: 'single' | 'double' = 'single'): void {
    const boxLines = this.createBox(content, width, style);
    boxLines.forEach(line => {
      this.renderText(line, Theme.colors.text.secondary);
    });
  }

  /**
   * Render a separator line
   */
  renderSeparator(width: number = 60, char: string = Theme.box.horizontal): void {
    const line = this.createHorizontalLine(width, char);
    this.renderMuted(line);
  }

  /**
   * Render the progress bar with info
   */
  renderProgress(current: number, total: number, label: string = 'Progress'): void {
    const progress = this.createProgressBar(current, total);
    
    console.log('');
    this.renderMuted(`${label}: ${progress.text} (${progress.percentage}%)`);
    this.renderHighlight(progress.bar);
    console.log('');
  }

  /**
   * Render a list of options
   */
  renderOptions(options: string[], highlightIndex: number | null = null): void {
    options.forEach((option, index) => {
      const number = index + 1;
      const isHighlighted = highlightIndex === index;
      
      if (isHighlighted) {
        this.renderHighlight(`   ${number}. ${option}`);
      } else {
        this.renderText(`   ${number}. ${option}`, Theme.colors.text.secondary);
      }
    });
  }

  /**
   * Render an input field with cursor
   */
  renderInput(label: string, value: string = '', showCursor: boolean = true): void {
    const cursor = showCursor ? this.getCursor() : '';
    const displayValue = value + cursor;
    
    console.log('');
    this.renderHighlight(`${Theme.icons.chevron} ${label}`);
    console.log('');
    this.renderText(`  ${displayValue}`, Theme.colors.primary);
    console.log('');
  }

  /**
   * Render a yes/no question
   */
  renderYesNo(question: string, value: boolean | null = null, yesLabel: string = 'Yes', noLabel: string = 'No'): void {
    console.log('');
    this.renderHighlight(`${Theme.icons.question} ${question}`);
    console.log('');
    
    const yesText = `  ${Theme.icons.bulletEmpty} Y - ${yesLabel}`;
    const noText = `  ${Theme.icons.bulletEmpty} N - ${noLabel}`;
    
    if (value === true) {
      this.renderHighlight(yesText);
      this.renderMuted(noText);
    } else if (value === false) {
      this.renderMuted(yesText);
      this.renderHighlight(noText);
    } else {
      this.renderMuted(yesText);
      this.renderMuted(noText);
    }
    
    console.log('');
  }

  /**
   * Render rating with stars
   */
  renderRating(label: string, value: number = 0, max: number = 5): void {
    console.log('');
    this.renderHighlight(`${Theme.icons.star} ${label}`);
    console.log('');
    
    let stars = '';
    for (let i = 1; i <= max; i++) {
      if (i <= value) {
        stars += Theme.icons.star + ' ';
      } else {
        stars += Theme.icons.starEmpty + ' ';
      }
    }
    
    this.renderText(`  ${stars}`, Theme.colors.warning);
    this.renderMuted(`  (${value}/${max})`);
    console.log('');
  }

  /**
   * Render a summary with key-value data
   */
  renderSummary(title: string, data: Record<string, unknown>): void {
    console.log('');
    this.renderTitle(title);
    this.renderSeparator(60);
    console.log('');
    
    Object.entries(data).forEach(([key, value]) => {
      const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
      this.renderText(`${Theme.icons.bullet} ${displayKey}:`, Theme.colors.text.secondary);
      this.renderHighlight(`  ${value}`);
      console.log('');
    });
    
    this.renderSeparator(60);
  }

  /**
   * Render a help/commands message
   */
  renderHelp(commands: Array<{ command: string; description: string }>, title: string = 'Available Commands'): void {
    console.log('');
    this.renderTitle(`📋 ${title}`);
    this.renderSeparator(60);
    console.log('');
    
    commands.forEach(({ command, description }) => {
      this.renderHighlight(`  ${Theme.icons.chevron} ${command}`);
      this.renderMuted(`    ${description}`);
      console.log('');
    });
    
    this.renderSeparator(60);
  }

  /**
   * Render an animated welcome message
   */
  renderWelcome(title: string, subtitle: string | null = null): void {
    this.clear();
    console.log('');
    console.log('');
    
    this.renderTitle(`✨ ${title} ✨`);
    
    if (subtitle) {
      console.log('');
      this.renderSubtitle(subtitle);
    }
    
    console.log('');
    this.renderSeparator(60, Theme.box.doubleHorizontal);
    console.log('');
  }

  /**
   * Render a spinner/loader (static, not animated)
   */
  renderLoader(message: string = 'Loading...'): void {
    const spinner = Theme.icons.spinner[0];
    this.renderText(`${spinner} ${message}`, Theme.colors.info);
  }

  /**
   * Cleanup the renderer
   */
  destroy(): void {
    this.stopCursorBlink();
  }
}
