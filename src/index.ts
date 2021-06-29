import { LogEventRobloxOutputSink, RobloxOutputOptions } from "./Core/LogEventRobloxOutputSink";
import { Logger } from "./Logger";
export { Logger } from "./Logger";
export { LogLevel, LogEvent } from "./Core";

namespace Log {
	let defaultLogger: Logger = Logger.default();

	export function SetLogger(logger: Logger) {
		defaultLogger = logger;
	}

	export function Default() {
		return defaultLogger;
	}

	/**
	 * Creates a custom logger
	 * @returns The logger configuration, use `Initialize` to get the logger once configured
	 */
	export function Create() {
		return Logger.configure();
	}

	export const RobloxOutput = (options: RobloxOutputOptions = {}) => new LogEventRobloxOutputSink(options);

	/**
	 * Write a "Fatal" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Fatal(template: string, ...args: unknown[]) {
		defaultLogger?.Fatal(template, ...args);
	}

	/**
	 * Write a "Verbose" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Verbose(template: string, ...args: unknown[]) {
		defaultLogger?.Verbose(template, ...args);
	}

	/**
	 * Write an "Information" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Info(template: string, ...args: unknown[]) {
		defaultLogger?.Info(template, ...args);
	}

	/**
	 * Write a "Debugging" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Debug(template: string, ...args: unknown[]) {
		defaultLogger?.Debug(template, ...args);
	}

	/**
	 * Write a "Warning" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Warn(template: string, ...args: unknown[]) {
		defaultLogger?.Warn(template, ...args);
	}

	/**
	 * Write an "Error" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Error(template: string, ...args: unknown[]) {
		defaultLogger?.Error(template, ...args);
	}
}
export default Log;
