import { LogLevel, StructuredMessage } from "./Configuration";
import { MessageTemplateParser } from "@rbxts/message-templates/out/MessageTemplateParser";
import { PlainTextMessageTemplateRenderer } from "@rbxts/message-templates/out/PlainTextMessageTemplateRenderer";
import { Logger } from "./Logger";
export { Logger } from "./Logger";
export { LogLevel, StructuredMessage } from "./Configuration";

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

	export interface RobloxOutputOptions {
		/**
		 * Whether or not to show the time
		 *
		 * If true, it will be formatted like:
		 * - `19:38:23 [TAG] Message goes here`
		 * @deprecated Both the roblox output and developer console now have this by default.
		 */
		ShowCurrentTime?: boolean;
		/**
		 * The tag format
		 * - `short` - `DBG`, `INF`, `WRN`, `ERR`, `FTL`
		 * - `full` - `DEBUG`, `INFO`, `WARNING`, `ERROR`, `FATAL`
		 */
		TagFormat?: "short" | "full";
	}

	export const RobloxOutput = (options: RobloxOutputOptions = {}) => {
		const { ShowCurrentTime = false, TagFormat = "short" } = options;
		return (message: StructuredMessage) => {
			const template = new PlainTextMessageTemplateRenderer(MessageTemplateParser.GetTokens(message.Template));
			const time = DateTime.fromIsoDate(message.Timestamp)?.FormatLocalTime("HH:mm:ss", "en-us");
			let tag: string;
			switch (message.Level) {
				case LogLevel.Verbose:
					tag = TagFormat === "short" ? "VVV" : "VERBOSE";
					break;
				case LogLevel.Debugging:
					tag = TagFormat === "short" ? "DBG" : "DEBUG";
					break;
				case LogLevel.Information:
					tag = TagFormat === "short" ? "INF" : "INFO";
					break;
				case LogLevel.Warning:
					tag = TagFormat === "short" ? "WRN" : "WARNING";
					break;
				case LogLevel.Error:
					tag = TagFormat === "short" ? "ERR" : "ERROR";
					break;
				case LogLevel.Fatal:
					tag = TagFormat === "short" ? "FTL" : "FATAL";
					break;
			}

			const messageRendered = template.Render(message);
			const formattedMessage = ShowCurrentTime
				? `${time} [${tag}] ${messageRendered}`
				: `[${tag}] ${messageRendered}`;

			if (message.Level >= LogLevel.Warning) {
				warn(formattedMessage);
			} else {
				print(formattedMessage);
			}
		};
	};

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
