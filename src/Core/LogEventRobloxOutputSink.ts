import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";
import { ILogEventSink, LogEvent, LogLevel } from "../Core";
const logService = game.GetService("LogService");

export interface RobloxOutputOptions {
	/**
	 * The tag format
	 * - `short` - `DBG`, `INF`, `WRN`, `ERR`, `FTL`
	 * - `full` - `DEBUG`, `INFO`, `WARNING`, `ERROR`, `FATAL`
	 */
	TagFormat?: "short" | "full";

	/**
	 * Ignores logging errors.
	 *
	 * Use this if you use the `throw Log.Error(...)` or `throw Log.Fatal(...)` patterns.
	 */
	ErrorsTreatedAsExceptions?: boolean;

	/**
	 * A prefix to add to each output message before the severity tag e.g. `EXAMPLE` will become `[EXAMPLE] [INF]: Example!`
	 */
	Prefix?: string;
}

export class LogEventRobloxOutputSink implements ILogEventSink {
	public constructor(private options: RobloxOutputOptions) {}
	Emit(message: LogEvent): void {
		const { TagFormat = "short", ErrorsTreatedAsExceptions, Prefix } = this.options;

		if (message.Level >= LogLevel.Error && ErrorsTreatedAsExceptions) {
			return;
		}

		const template = new PlainTextMessageTemplateRenderer(MessageTemplateParser.GetTokens(message.Template));
		const time = DateTime.fromIsoDate(message.Timestamp)?.FormatLocalTime("HH:mm:ss", "en-us");
		let tag: string;
		switch (message.Level) {
			case LogLevel.Verbose:
				tag = TagFormat === "short" ? "VRB" : "VERBOSE";
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
		const formattedMessage =
			Prefix !== undefined ? `[${Prefix}] [${tag}] ${messageRendered}` : `[${tag}] ${messageRendered}`;

		switch (message.Level) {
			case LogLevel.Verbose:
				logService.Output(formattedMessage);
				break;
			case LogLevel.Debugging:
				logService.Output(formattedMessage);
				break;
			case LogLevel.Information:
				logService.Info(formattedMessage);
				break;
			case LogLevel.Warning:
				logService.Warn(formattedMessage);
				break;
			case LogLevel.Error:
				logService.Error(formattedMessage);
				break;
			case LogLevel.Fatal:
				logService.Error(formattedMessage);
				break;
		}
	}
}
