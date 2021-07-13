import { MessageTemplateParser } from "@rbxts/message-templates/out/MessageTemplateParser";
import { PropertyToken, TemplateTokenKind } from "@rbxts/message-templates/out/MessageTemplateToken";
import { LogLevel, ILogEventEnricher, ILogEventSink, LogEvent } from "./Core";
import { LogConfiguration } from "./Configuration";

export class Logger {
	private sinks: ReadonlyArray<ILogEventSink>;
	private enrichers: ReadonlyArray<ILogEventEnricher>;

	private logLevel: LogLevel = LogLevel.Information;
	private constructor() {
		this.sinks = [];
		this.enrichers = [];
	}

	public static configure() {
		return new LogConfiguration(new Logger());
	}

	/** @internal */
	public _setSinks(sinks: ReadonlyArray<ILogEventSink>) {
		this.sinks = sinks;
	}

	public _setEnrichers(enrichers: ReadonlyArray<ILogEventEnricher>) {
		this.enrichers = enrichers;
	}

	/** @internal */
	public _setMinLogLevel(logLevel: LogLevel) {
		this.logLevel = logLevel;
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

	/**
	 * Writes a log event
	 * @param logLevel The log level of this event
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Write(logLevel: LogLevel, template: string, ...args: unknown[]) {
		const message: LogEvent = {
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

		for (const enricher of this.enrichers) {
			const toApply = new Map<string, defined>();
			enricher.Enrich(message, toApply);
			for (const [key, value] of toApply) {
				message[key] = value;
			}
		}

		for (const sink of this.sinks) {
			sink.Emit(message);
		}
	}

	/**
	 * Returns the log level of this logger
	 */
	public GetLevel() {
		return this.logLevel;
	}

	/**
	 * Writes a verbose message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Verbose(template: string, ...args: unknown[]) {
		if (this.GetLevel() > LogLevel.Verbose) return;
		this.Write(LogLevel.Verbose, template, ...args);
	}

	/**
	 * Writes an information message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Info(template: string, ...args: unknown[]) {
		if (this.GetLevel() > LogLevel.Information) return;
		this.Write(LogLevel.Information, template, ...args);
	}

	/**
	 * Writes a debug message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Debug(template: string, ...args: unknown[]) {
		if (this.GetLevel() > LogLevel.Debugging) return;
		this.Write(LogLevel.Debugging, template, ...args);
	}

	/**
	 * Writes a warning message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Warn(template: string, ...args: unknown[]) {
		if (this.GetLevel() > LogLevel.Warning) return;
		this.Write(LogLevel.Warning, template, ...args);
	}

	/**
	 * Writes a error message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Error(template: string, ...args: unknown[]) {
		if (this.GetLevel() > LogLevel.Error) return;
		this.Write(LogLevel.Error, template, ...args);
	}

	/**
	 * Writes a fatal message to this log stream
	 * @param template The template message using the [Message Templates](https://messagetemplates.org/) spec.
	 * @param args The values to apply to the template
	 */
	public Fatal(template: string, ...args: unknown[]) {
		this.Write(LogLevel.Fatal, template, ...args);
	}

	/**
	 * Creates a copy of this logger, and allows you to configure it
	 * @returns The configuration for a copy of this logger
	 */
	public Copy() {
		const config = new LogConfiguration(new Logger());
		config.SetMinLogLevel(this.GetLevel());
		for (const sink of this.sinks) {
			config.WriteTo(sink);
		}
		for (const enricher of this.enrichers) {
			config.Enrich(enricher);
		}
		return config;
	}

	/**
	 * Creates a logger that enriches log events with the specified context as the property `SourceContext`.
	 * @param context The tag to use
	 */
	public ForContext(context: LoggerContext) {
		let sourceContext: string;
		if (typeIs(context, "Instance")) {
			sourceContext = context.GetFullName();
		} else {
			sourceContext = tostring(context);
		}

		return this.Copy().EnrichWithProperty("SourceContext", sourceContext).Create();
	}

	/**
	 * Creates a logger that enriches log events with the `SourceContext` as the containing script
	 */
	public ForScript() {
		const [s] = debug.info(2, "s");
		return this.Copy().EnrichWithProperty("SourceContext", s).Create();
	}

	/**
	 * Creates a logger that enriches log events with `SourceContext` as the specified function
	 */
	public ForFunction(func: () => void) {
		const [n] = debug.info(func, "f");
		return this.Copy().EnrichWithProperty("SourceContext", n ?? "<anonymous>");
	}

	/**
	 * Creates a logger that nriches log events with the specified property
	 * @param name The name of the property
	 * @param value The value of the property
	 */
	public ForProperty(name: string, value: defined) {
		return this.Copy().EnrichWithProperty(name, value).Create();
	}
}

export type LoggerContext = Instance | (new (...args: unknown[]) => unknown) | { toString(): string };
