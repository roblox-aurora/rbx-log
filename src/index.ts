import { LogConfiguration, LogLevel, StructuredMessage } from "./Configuration";
import Logger from "./Logger";

namespace Log {
	const defaultLogger = Logger.default();

	/**
	 * Configure the default logger
	 * @returns A configuration builder for the default logger
	 */
	export function Configure() {
		return new LogConfiguration(defaultLogger);
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
			const time = DateTime.fromUnixTimestamp(os.time()).FormatLocalTime("HH:MM:ss", "en-us");
			let tag: string;
			switch (message.Level) {
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
			}

			// TODO: MessageTemplate
			if (message.Level >= LogLevel.Warning) {
				warn(time, `[${tag}]`, message.Template);
			} else {
				print(time, `[${tag}]`, message.Template);
			}
		};
	};

	/**
	 * Write an "Information" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Info(template: string, ...args: unknown[]) {
		defaultLogger.Info(template, ...args);
	}

	/**
	 * Write a "Debugging" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Debug(template: string, ...args: unknown[]) {
		defaultLogger.Debug(template, ...args);
	}

	/**
	 * Write a "Warning" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Warn(template: string, ...args: unknown[]) {
		defaultLogger.Warn(template, ...args);
	}

	/**
	 * Write an "Error" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Error(template: string, ...args: unknown[]) {
		defaultLogger.Error(template, ...args);
	}
}
export = Log;
