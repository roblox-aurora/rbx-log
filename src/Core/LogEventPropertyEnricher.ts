import { ILogEventEnricher, LogEvent, LogLevel } from "./index";

export interface ILogEventPropertyEnricher extends ILogEventEnricher {
	SetMinLogLevel(minLogLevel: LogLevel): void;
}

export class LogEventPropertyEnricher<V extends { [P in string]: defined }> implements ILogEventPropertyEnricher {
	private minLogLevel?: LogLevel;

	constructor(private props: V) {}

	Enrich(message: Readonly<LogEvent>, properties: Map<string, defined>): void {
		const minLogLevel = this.minLogLevel;
		if (minLogLevel === undefined || message.Level >= minLogLevel) {
			for (const [k, v] of pairs(this.props)) {
				properties.set(k as string, v);
			}
		}
	}

	public SetMinLogLevel(minLogLevel: LogLevel) {
		this.minLogLevel = minLogLevel;
	}
}
