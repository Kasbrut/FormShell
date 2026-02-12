/**
 * FormShell - Form Framework
 * Framework for interactive multi-step forms in the browser console
 * One-question-at-a-time style with simple API for interaction
 */

import './global.d.ts';

import {
  ChoiceField,
  FieldFactory,
  MultipleChoiceField,
  NumberField,
  RatingField,
} from "./field-types.js";
import { Theme } from "./theme.js";
import { TUIRenderer } from "./tui-renderer.js";
import type {
  FieldConfig,
  FieldInstance,
  FormConfig,
  FormData,
  ProgressInfo,
  Step,
} from "./types.js";

export class FormShell {
	title: string;
	subtitle: string | null;
	endpoint: string | null;
	onComplete: ((data: FormData) => void | Promise<void>) | null;
	steps: Step[];

	private currentStepIndex: number;
	private renderer: TUIRenderer;
	private started: boolean;
	private completed: boolean;
	private startTime: number | null;
	private helpActive: boolean;

	constructor(config: FormConfig) {
		this.title = config.title || "Form";
		this.subtitle = config.subtitle || null;
		this.endpoint = config.endpoint || null;
		this.onComplete = config.onComplete || null;
		this.steps = this.initializeSteps(config.steps || []);

		this.currentStepIndex = -1; // -1 = welcome screen
		this.renderer = new TUIRenderer();
		this.started = false;
		this.completed = false;
		this.startTime = null;
		this.helpActive = false;

		// Initialize the renderer
		this.renderer.init();

		// Show welcome screen
		this.showWelcome();
	}

	/**
	 * Initialize steps with appropriate field types
	 */
	private initializeSteps(stepsConfig: FieldConfig[]): Step[] {
		return stepsConfig.map((stepConfig, index) => {
			const field = FieldFactory.create(stepConfig);
			return {
				id: stepConfig.id || `step_${index}`,
				field,
				description: stepConfig.description ?? null,
				answered: false,
			};
		});
	}

	/**
	 * Show welcome screen
	 */
	private showWelcome(): void {
		this.renderer.clear();
		console.log("");
		this.renderer.renderTitle(this.title);
		if (this.subtitle) {
			this.renderer.renderMuted(this.subtitle);
		}
		console.log("");
		this.renderer.renderMuted("Type formShell.start() to begin or formShell.help() for available commands");
		console.log("");
	}

	/**
	 * Show help screen with commands.
	 * Can be called at any time without interrupting the form flow.
	 * Use formShell.continue() to resume where you left off.
	 */
	help(): void {
		this.helpActive = true;

		this.renderer.clear();
		console.log("");

		this.renderer.renderTitle(this.title);
		if (this.subtitle) {
			this.renderer.renderMuted(this.subtitle);
		}
		console.log("");

		this.renderer.renderHighlight("Commands:");
		this.renderer.renderMuted("  formShell.start()              Start the form");
		this.renderer.renderMuted("  formShell.continue()           Resume the form");
		this.renderer.renderMuted("  formShell.answer(...)          Answer and proceed");
		this.renderer.renderMuted("  formShell.skip()               Skip (if optional)");
		this.renderer.renderMuted("  formShell.y() / formShell.n()  Yes / No");
		this.renderer.renderMuted("  formShell.back()               Go back");
		this.renderer.renderMuted("  formShell.submit()             Submit (at the end)");
		this.renderer.renderMuted("  formShell.reset()              Start over");
		this.renderer.renderMuted("  formShell.help()               Show this help");
		console.log("");

		this.renderer.renderMuted("Type formShell.continue() to resume");
		console.log("");
	}

	/**
	 * Start the form (only from welcome screen)
	 */
	start(): void {
		if (this.helpActive) {
			this.renderer.renderError("Use formShell.continue() to resume the form first");
			return;
		}

		if (this.started) {
			this.renderer.renderError("Form already started. Use formShell.reset() to start over");
			return;
		}

		const firstVisibleIndex = this.getNextVisibleStep(-1);
		if (firstVisibleIndex >= this.steps.length) {
			this.renderer.renderError("No visible steps in form");
			return;
		}

		this.currentStepIndex = firstVisibleIndex;
		this.started = true;
		this.startTime = Date.now();
		this.renderCurrentStep();
	}

	/**
	 * Resume the form after viewing help
	 */
	continue(): void {
		if (!this.helpActive) {
			if (!this.started) {
				this.renderer.renderError("Use formShell.start() to begin the form");
			} else {
				this.renderer.renderError("Use formShell.answer() to respond to the current question");
			}
			return;
		}

		this.helpActive = false;

		// Restore the appropriate view
		if (!this.started) {
			this.showWelcome();
		} else if (this.completed) {
			this.showSummary();
		} else {
			this.renderCurrentStep();
		}
	}

	/**
	 * Check if a step should be shown based on its condition
	 */
	private shouldShowStep(stepIndex: number): boolean {
		const step = this.steps[stepIndex];
		if (!step.field.condition) {
			return true; // No condition = always show
		}

		// Collect current form data to evaluate condition
		const currentData = this.collectData();
		return step.field.condition(currentData);
	}

	/**
	 * Get next visible step index
	 */
	private getNextVisibleStep(fromIndex: number): number {
		for (let i = fromIndex + 1; i < this.steps.length; i++) {
			if (this.shouldShowStep(i)) {
				return i;
			}
		}
		return this.steps.length; // End of form
	}

	/**
	 * Get previous visible step index
	 */
	private getPreviousVisibleStep(fromIndex: number): number {
		for (let i = fromIndex - 1; i >= 0; i--) {
			if (this.shouldShowStep(i)) {
				return i;
			}
		}
		return -1; // Start of form
	}

	/**
	 * Advance to next step (internal method)
	 */
	private _advanceStep(): void {
		if (this.completed) {
			return;
		}

		// Get next visible step
		const nextIndex = this.getNextVisibleStep(this.currentStepIndex);

		if (nextIndex < this.steps.length) {
			this.currentStepIndex = nextIndex;
			this.renderCurrentStep();
		} else {
			// Form completed, show summary
			this.completed = true;
			this.showSummary();
		}
	}

	/**
	 * Go back to previous step
	 */
	back(): void {
		if (this.helpActive) {
			this.renderer.renderError("Use formShell.continue() to resume the form first");
			return;
		}

		const prevIndex = this.getPreviousVisibleStep(this.currentStepIndex);

		if (prevIndex < 0) {
			this.renderer.renderError("Already at first question. Use formShell.help() for commands");
			return;
		}

		this.currentStepIndex = prevIndex;
		this.completed = false;
		this.renderCurrentStep();
	}

	/**
	 * Answer the current question
	 */
	answer(value: string | number): void {
		if (this.helpActive) {
			this.renderer.renderError("Use formShell.continue() to resume the form first");
			return;
		}

		if (!this.started) {
			this.renderer.renderError("Use formShell.start() to begin the form");
			return;
		}

		if (this.completed) {
			this.renderer.renderError("Form already completed! Use formShell.submit() to send or formShell.reset() to start over");
			return;
		}

		const step = this.steps[this.currentStepIndex];
		const field = step.field;

		// Try to set the value
		const success = field.setValue(value);

		if (success) {
			step.answered = true;
			this.renderer.renderSuccess(`${field.format(field.getValue())}`);
			console.log("");

			// Automatically advance to next step after 1 second
			setTimeout(() => {
				this._advanceStep();
			}, 1000);
		} else {
			this.renderer.renderError(field.error ?? "Invalid value");
			console.log("");
		}
	}

	/**
	 * Shortcut to answer "Yes"
	 */
	y(): void {
		this.answer("y");
	}

	/**
	 * Shortcut to answer "No"
	 */
	n(): void {
		this.answer("n");
	}

	/**
	 * Skip the current question (only if not required)
	 */
	skip(): void {
		if (this.helpActive) {
			this.renderer.renderError("Use formShell.continue() to resume the form first");
			return;
		}

		if (!this.started) {
			this.renderer.renderError("Use formShell.start() to begin the form");
			return;
		}

		if (this.completed) {
			this.renderer.renderError("Form already completed! Use formShell.submit() to send or formShell.reset() to start over");
			return;
		}

		const step = this.steps[this.currentStepIndex];
		const field = step.field;

		if (field.required) {
			this.renderer.renderError("This question is required and cannot be skipped");
			console.log("");
			return;
		}

		// Mark as answered (with null value)
		step.answered = true;
		field.value = null;
		this.renderer.renderMuted("Skipped");
		console.log("");

		// Automatically advance to next step after 1 second
		setTimeout(() => {
			this._advanceStep();
		}, 1000);
	}

	/**
	 * Reset the form
	 */
	reset(): void {
		this.currentStepIndex = -1;
		this.started = false;
		this.completed = false;
		this.startTime = null;
		this.helpActive = false;

		// Reset all steps
		this.steps.forEach((step) => {
			step.answered = false;
			step.field.value = null;
			step.field.error = null;
		});

		this.showWelcome();
	}

	/**
	 * Submit data to server
	 */
	async submit(): Promise<void> {
		if (this.helpActive) {
			this.renderer.renderError("Use formShell.continue() to resume the form first");
			return;
		}

		if (!this.completed) {
			this.renderer.renderError("Complete all questions first!");
			return;
		}

		const data = this.collectData();
		console.log("");
		this.renderer.renderMuted("Submitting...");

		try {
			if (this.endpoint) {
				const response = await fetch(this.endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				this.renderer.renderSuccess("Submitted!");
				console.log("");

				if (this.onComplete) {
					await this.onComplete(result);
				}

				console.log("Response:", result);
			} else {
				this.renderer.renderSuccess("Completed!");
				console.log("");
				console.log("Data:", data);

				if (this.onComplete) {
					await this.onComplete(data);
				}
			}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.renderer.renderError(`Error: ${message}`);
			console.log("");
		}
	}

	/**
	 * Collect all form data
	 */
	private collectData(): FormData {
		const data: FormData = {};
		this.steps.forEach((step) => {
			data[step.field.id] = step.field.getValue();
		});
		return data;
	}

	/**
	 * Calculate completion percentage
	 */
	getProgress(): ProgressInfo {
		// Only count visible steps
		const visibleSteps = this.steps.filter((_, idx) =>
			this.shouldShowStep(idx),
		);
		const answeredVisible = visibleSteps.filter((s) => s.answered).length;

		return {
			current: answeredVisible,
			total: visibleSteps.length,
			percentage:
				visibleSteps.length > 0
					? Math.round((answeredVisible / visibleSteps.length) * 100)
					: 0,
		};
	}

	/**
	 * Estimate remaining time
	 */
	getEstimatedTime(): string | null {
		if (!this.startTime || this.currentStepIndex < 1) {
			return null;
		}

		const elapsed = Date.now() - this.startTime;
		const avgTimePerStep = elapsed / (this.currentStepIndex + 1);
		const remainingSteps = this.steps.length - this.currentStepIndex - 1;
		const estimatedMs = avgTimePerStep * remainingSteps;

		const seconds = Math.round(estimatedMs / 1000);
		if (seconds < 60) {
			return `~${seconds}s`;
		} else {
			const minutes = Math.round(seconds / 60);
			return `~${minutes}m`;
		}
	}

	/**
	 * Render the current step
	 */
	private renderCurrentStep(): void {
		this.renderer.clear();

		const step = this.steps[this.currentStepIndex];
		const field = step.field;

		console.log("");

		// Calculate progress for visible steps only
		const progress = this.getProgress();
		const visibleStepNumber = this.getVisibleStepNumber(this.currentStepIndex);

		// Compact progress bar
		const progressBar = this.renderer.createProgressBar(
			visibleStepNumber,
			progress.total,
			30,
		);
		this.renderer.renderMuted(`[${progressBar.bar}] ${progressBar.text}`);
		console.log("");

		// Question title
		this.renderer.renderHighlight(`${visibleStepNumber}. ${field.label}`);

		// Additional description if present
		if (step.description) {
			this.renderer.renderMuted(`   ${step.description}`);
		}
		console.log("");

		// Render field based on type
		this.renderField(field);
	}

	/**
	 * Get the visible step number (position among visible steps)
	 */
	private getVisibleStepNumber(stepIndex: number): number {
		let visibleCount = 0;
		for (let i = 0; i <= stepIndex; i++) {
			if (this.shouldShowStep(i)) {
				visibleCount++;
			}
		}
		return visibleCount;
	}

	/**
	 * Render a field based on its type
	 */
	private renderField(field: FieldInstance): void {
		if (field instanceof RatingField) {
			this.renderer.renderMuted(`   formShell.answer(1-${field.max})`);
			const stars = Theme.icons.starEmpty.repeat(field.max ?? 5);
			this.renderer.renderText(`   ${stars}`, Theme.colors.warning);
		} else if (field instanceof ChoiceField) {
			this.renderer.renderOptions(
				field.options.map((opt) =>
					typeof opt === "string" ? opt : opt.label,
				),
			);
			this.renderer.renderMuted("   formShell.answer(number)");
		} else if (field instanceof MultipleChoiceField) {
			this.renderer.renderOptions(
				field.options.map((opt) =>
					typeof opt === "string" ? opt : opt.label,
				),
			);
			this.renderer.renderMuted('   formShell.answer("1,2,3")');
		} else if (field.type === "yesno") {
			this.renderer.renderMuted("   formShell.y() / formShell.n()");
		} else {
			// Text, Number, Email, URL, Date
			const placeholder = this.getPlaceholder(field);
			this.renderer.renderMuted(`   formShell.answer("${placeholder}")`);
		}

		// Show skip option if field is optional
		if (!field.required) {
			this.renderer.renderMuted("   formShell.skip() to skip");
		}

		console.log("");
	}

	/**
	 * Get a placeholder for the field
	 */
	private getPlaceholder(field: FieldInstance): string {
		switch (field.type) {
			case "email":
				return "email@example.com";
			case "url":
				return "https://...";
			case "date":
				return "DD/MM/YYYY";
			case "number": {
				if (field instanceof NumberField) {
					return field.min !== null
						? `${field.min}-${field.max ?? "..."}`
						: "number";
				}
				return "number";
			}
			default:
				return "your answer";
		}
	}

	/**
	 * Show final summary
	 */
	private showSummary(): void {
		this.renderer.clear();
		console.log("");
		this.renderer.renderTitle("Summary");
		console.log("");

		// Only show visible (answered) steps
		let displayIndex = 1;
		this.steps.forEach((step) => {
			// Skip steps that don't meet their condition
			if (step.field.condition) {
				const currentData = this.collectData();
				if (!step.field.condition(currentData)) {
					return; // Skip this step in summary
				}
			}

			const field = step.field;
			const value = field.getValue();
			const formattedValue = field.format(value);

			this.renderer.renderMuted(`${displayIndex}. ${field.label}`);
			this.renderer.renderHighlight(`   ${formattedValue}`);
			displayIndex++;
		});

		console.log("");
		this.renderer.renderSuccess("Completed!");
		this.renderer.renderMuted("formShell.submit() to send | formShell.back() to modify");
		console.log("");
	}

	/**
	 * Cleanup when form is destroyed
	 */
	destroy(): void {
		this.renderer.destroy();
	}
}

// Export for use as module
export default FormShell;
