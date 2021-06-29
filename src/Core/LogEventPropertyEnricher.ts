import { ILogEventEnricher, LogEvent, LogLevel } from "./index";

export interface ILogEventPropertyEnricher {
	SetMinLogLevel(minLogLevel: LogLevel): void;
}

export class LogEventPropertyEnricher<V extends defined> implements ILogEventEnricher, ILogEventPropertyEnricher {
	private minLogLevel?: LogLevel;

	constructor(private propertyName: string, private value: V) {}

	Enrich(message: Readonly<LogEvent>, properties: Map<string, defined>): void {
		const minLogLevel = this.minLogLevel;
		if (minLogLevel === undefined || message.Level >= minLogLevel) {
			properties.set(this.propertyName, this.value);
		}
	}

	SetMinLogLevel(minLogLevel: LogLevel) {
		this.minLogLevel = minLogLevel;
	}
}
