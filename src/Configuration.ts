import Logger from "./Logger";

export interface StructuredMessage {
	readonly Level: LogLevel;
	readonly Time: number;
	readonly Template: string;
	readonly [name: string]: defined;
}
export enum LogLevel {
	Debugging,
	Information,
	Warning,
	Error,
}
export interface LogSink {
	(message: StructuredMessage): void;
}

export class LogConfiguration {
	private sinks = new Array<LogSink>();
	private logLevel = LogLevel.Information;
	public constructor(private logger: Logger) {}

	public WriteTo(sink: LogSink) {
		this.sinks.push(sink);
		return this;
	}

	public SetLogLevel(logLevel: LogLevel) {
		this.logLevel = logLevel;
	}

	public Initialize() {
		this.logger._setSinks(this.sinks);
		return this.logger;
	}
}
