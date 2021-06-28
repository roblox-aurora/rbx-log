import { LogConfiguration, LogEnricher, LogLevel, LogSink, StructuredMessage } from "./Configuration";

export default class Logger {
	private sinks: ReadonlyArray<LogSink>;
	private enrichers: ReadonlyArray<LogEnricher>;

	private minLogLevel = LogLevel.Information;
	public constructor() {
		this.sinks = [];
		this.enrichers = [];
	}

	/** @internal */
	public _setSinks(sinks: ReadonlyArray<LogSink>) {
		this.sinks = sinks;
	}

	public _setEnrichers(enrichers: ReadonlyArray<LogEnricher>) {
		this.enrichers = enrichers;
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

	private _write(logLevel: LogLevel, template: string, ...args: unknown[]) {
		const message: StructuredMessage = {
			Level: logLevel,
			Template: template,
			Timestamp: DateTime.now().ToIsoDate(),
		};

		for (const enrich of this.enrichers) {
			enrich(message);
		}

		for (const sink of this.sinks) {
			sink(message);
		}
	}

	public Verbose(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Verbose) return;
		this._write(LogLevel.Verbose, template, ...args);
	}

	public Info(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Information) return;
		this._write(LogLevel.Information, template, ...args);
	}

	public Debug(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Debugging) return;
		this._write(LogLevel.Debugging, template, ...args);
	}

	public Warn(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Warning) return;
		this._write(LogLevel.Warning, template, ...args);
	}

	public Error(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Error) return;
		this._write(LogLevel.Error, template, ...args);
	}

	public Fatal(template: string, ...args: unknown[]) {
		this._write(LogLevel.Fatal, template, ...args);
	}
}
