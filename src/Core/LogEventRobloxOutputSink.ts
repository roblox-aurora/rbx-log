import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";
import { ILogEventSink, LogEvent, LogLevel } from "../Core";

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
export class LogEventRobloxOutputSink implements ILogEventSink {
	public constructor(private options: RobloxOutputOptions) {}
	Emit(message: LogEvent): void {
		const { ShowCurrentTime, TagFormat } = this.options;

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
	}
}
