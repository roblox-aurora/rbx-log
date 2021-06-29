import { MessageTemplateParser } from "@rbxts/message-templates/out/MessageTemplateParser";
import { PropertyToken, TemplateTokenKind } from "@rbxts/message-templates/out/MessageTemplateToken";
import { LogConfiguration, LogEnricher, LogLevel, LogSink, StructuredMessage } from "./Configuration";

export class Logger {
	private sinks: ReadonlyArray<LogSink>;
	private enrichers: ReadonlyArray<LogEnricher>;

	private minLogLevel = LogLevel.Information;
	private constructor() {
		this.sinks = [];
		this.enrichers = [];
	}

	public static configure() {
		return new LogConfiguration(new Logger());
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

	private static defaultLogger = new Logger();
	public static default() {
		return this.defaultLogger;
	}

	private _serializeValue(value: defined): defined {
		if (typeIs(value, "Vector3")) {
			return { X: value.X, Y: value.Y, Z: value.Z };
		} else if (typeIs(value, "Vector2")) {
			return { X: value.X, Y: value.Y };
		} else if (typeIs(value, "Instance")) {
			return value.GetFullName();
		} else if (typeIs(value, "EnumItem")) {
			return tostring(value);
		} else if (
			typeIs(value, "string") ||
			typeIs(value, "number") ||
			typeIs(value, "boolean") ||
			typeIs(value, "table")
		) {
			return value;
		} else {
			return tostring(value);
		}
	}

	private _write(logLevel: LogLevel, template: string, ...args: unknown[]) {
		const message: StructuredMessage = {
			Level: logLevel,
			Template: template,
			Timestamp: DateTime.now().ToIsoDate(),
		};

		const propertyTokens = MessageTemplateParser.GetTokens(template).filter(
			(t): t is PropertyToken => t.kind === TemplateTokenKind.Property,
		);

		let idx = 0;
		for (const token of propertyTokens) {
			message[token.propertyName] = this._serializeValue(args[idx++] as defined);
		}

		for (const enrich of this.enrichers) {
			enrich(message);
		}

		for (const sink of this.sinks) {
			sink(message);
		}
	}

	/**
	 * Writes a verbose message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Verbose(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Verbose) return;
		this._write(LogLevel.Verbose, template, ...args);
	}

	/**
	 * Writes an information message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Info(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Information) return;
		this._write(LogLevel.Information, template, ...args);
	}

	/**
	 * Writes a debug message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Debug(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Debugging) return;
		this._write(LogLevel.Debugging, template, ...args);
	}

	/**
	 * Writes a warning message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Warn(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Warning) return;
		this._write(LogLevel.Warning, template, ...args);
	}

	/**
	 * Writes a error message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Error(template: string, ...args: unknown[]) {
		if (this.minLogLevel > LogLevel.Error) return;
		this._write(LogLevel.Error, template, ...args);
	}

	/**
	 * Writes a fatal message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Fatal(template: string, ...args: unknown[]) {
		this._write(LogLevel.Fatal, template, ...args);
	}

	/**
	 * Creates a copy of this logger, and allows you to configure it
	 * @returns The configuration for a copy of this logger
	 */
	public ConfigureCopy() {
		const config = new LogConfiguration(new Logger());
		for (const sink of this.sinks) {
			config.WriteTo(sink);
		}
		for (const enricher of this.sinks) {
			config.Enrich(enricher);
		}
		return config;
	}
}
