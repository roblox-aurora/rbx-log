import { ILogEventSink, LogEvent, LogLevel } from ".";

export interface ILogEventCallbackSink {
	SetMinLogLevel(logLevel: LogLevel): void;
}

export class LogEventCallbackSink implements ILogEventSink, ILogEventCallbackSink {
	private minLogLevel?: LogLevel;
	public constructor(private callback: (message: LogEvent) => void) {}
	Emit(message: LogEvent): void {
		const { minLogLevel } = this;
		if (minLogLevel === undefined || message.Level >= minLogLevel) {
			this.callback(message);
		}
	}
	SetMinLogLevel(logLevel: LogLevel) {
		this.minLogLevel = logLevel;
	}
}
