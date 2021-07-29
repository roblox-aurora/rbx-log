export interface LogEvent {
	readonly Level: LogLevel;
	readonly Timestamp: string;
	readonly SourceContext: string | undefined;
	readonly Template: string;
	readonly [name: string]: unknown;
}
export enum LogLevel {
	Verbose,
	Debugging,
	Information,
	Warning,
	Error,
	Fatal,
}
export interface LogEventSinkCallback {
	(message: Readonly<LogEvent>): void;
}

export interface LogEventEnricherCallback {
	(message: LogEvent, properties: Map<string, defined>): void;
}

export interface ILogEventEnricher {
	Enrich(message: Readonly<LogEvent>, properties: Map<string, defined>): void;
}

export interface ILogEventSink {
	Emit(message: LogEvent): void;
}
