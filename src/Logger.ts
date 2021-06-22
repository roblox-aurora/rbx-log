import { LogConfiguration, LogLevel, LogSink, StructuredMessage } from "./Configuration";

export default class Logger {
	private sinks: ReadonlyArray<LogSink>;
	private minLogLevel = LogLevel.Information;
	public constructor() {
		this.sinks = [];
	}

	/** @internal */
	public _setSinks(sinks: ReadonlyArray<LogSink>) {
		this.sinks = sinks;
	}

	/** @internal */
	public _setMinLogLevel(logLevel: LogLevel) {
		this.minLogLevel = logLevel;
	}

	public Configure() {
		return new LogConfiguration(this);
	}

	private static defaultLogger = new Logger();
	public static default() {
		return this.defaultLogger;
	}

	public Info(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Information) return;

		for (const sink of this.sinks) {
			sink({
				Level: LogLevel.Information,
				Template: template,
				Time: os.time(),
				// TODO: Get arguments, place in object
			});
		}
	}
	public Debug(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Debugging) return;

		for (const sink of this.sinks) {
			sink({
				Level: LogLevel.Information,
				Template: template,
				Time: os.time(),
				// TODO: Get arguments, place in object
			});
		}
	}
	public Warn(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Warning) return;

		for (const sink of this.sinks) {
			sink({
				Level: LogLevel.Information,
				Template: template,
				Time: os.time(),
				// TODO: Get arguments, place in object
			});
		}
	}
	public Error(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Error) return;

		for (const sink of this.sinks) {
			sink({
				Level: LogLevel.Information,
				Template: template,
				Time: os.time(),
				// TODO: Get arguments, place in object
			});
		}
	}
}
