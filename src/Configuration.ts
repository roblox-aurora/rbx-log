import { Logger } from "./Logger";
const RunService = game.GetService("RunService");

export interface StructuredMessage {
	readonly Level: LogLevel;
	readonly Timestamp: string;
	readonly Template: string;
	[name: string]: defined;
}
export enum LogLevel {
	Verbose,
	Debugging,
	Information,
	Warning,
	Error,
	Fatal,
}
export interface LogSink {
	(message: Readonly<StructuredMessage>): void;
}

export interface LogEnricher {
	(message: StructuredMessage): void;
}

export class LogConfiguration {
	private sinks = new Array<LogSink>();
	private enrichers = new Array<LogEnricher>();
	private logLevel = RunService.IsStudio() ? LogLevel.Debugging : LogLevel.Information;
	public constructor(private logger: Logger) {}

	/**
	 * Adds an output sink (e.g. A console or analytics provider)
	 * @param sink The sink to add
	 */
	public WriteTo(sink: LogSink) {
		this.sinks.push(sink);
		return this;
	}

	/**
	 * Adds an "enricher", which adds extra properties to a log event.
	 */
	public Enrich(enricher: LogEnricher) {
		this.enrichers.push(enricher);
		return this;
	}

	/**
	 * Adds a static property value to each message
	 * @param propertyName The property name
	 * @param value The value of the property
	 */
	public EnrichWithProperty(propertyName: string, value: defined) {
		this.enrichers.push((message) => {
			message[propertyName] = value;
		});
		return this;
	}

	public SetMinLogLevel(logLevel: LogLevel) {
		this.logLevel = logLevel;
	}

	public Create() {
		this.logger._setSinks(this.sinks);
		this.logger._setEnrichers(this.enrichers);
		this.logger._setMinLogLevel(this.logLevel);
		return this.logger;
	}
}
