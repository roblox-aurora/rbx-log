import { MessageTemplateParser } from "./MessageTemplateParser";
import { LogConfiguration, LogLevel, StructuredMessage } from "./Configuration";
import Logger from "./Logger";
export { LogLevel } from "./Configuration";

namespace Log {
	let defaultLogger: Logger | undefined = Logger.default();

	export function SetLogger(logger: Logger) {
		defaultLogger = logger;
	}

	/**
	 * Creates a custom logger
	 * @returns The logger configuration, use `Initialize` to get the logger once configured
	 */
	export function Create() {
		return new Logger().Configure();
	}

	export const RobloxOutput = () => {
		return (message: StructuredMessage) => {
			const template = MessageTemplateParser.Parse(message.Template);
			const renderedTemplate = template.Render(message);

			const time = DateTime.fromIsoDate(message.Timestamp)?.FormatLocalTime("LT", "en-us");
			let tag: string;
			switch (message.Level) {
				case LogLevel.Verbose:
					tag = "VER";
					break;
				case LogLevel.Debugging:
					tag = "DBG";
					break;
				case LogLevel.Information:
					tag = "INF";
					break;
				case LogLevel.Warning:
					tag = "WRN";
					break;
				case LogLevel.Error:
					tag = "ERR";
					break;
				case LogLevel.Fatal:
					tag = "WTF";
					break;
			}

			if (message.Level >= LogLevel.Warning) {
				warn(time, `[${tag}]`, renderedTemplate);
			} else {
				print(time, `[${tag}]`, renderedTemplate);
			}
		};
	};

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
