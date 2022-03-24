import { ILogEventPropertyEnricher, LogEventPropertyEnricher } from "./Core/LogEventPropertyEnricher";
import { LogEventSinkCallback, LogLevel, ILogEventEnricher, ILogEventSink, ConfigureOnly } from "./Core";
import { Logger } from "./Logger";
import { ILogEventCallbackSink, LogEventCallbackSink } from "./Core/LogEventCallbackSink";
const RunService = game.GetService("RunService");

export class LogConfiguration {
	private sinks = new Array<ILogEventSink>();
	private enrichers = new Array<ILogEventEnricher>();
	private logLevel = RunService.IsStudio() ? LogLevel.Debugging : LogLevel.Information;
	public constructor(private logger: Logger) {}

	/**
	 * Adds an output sink (e.g. A console or analytics provider)
	 * @param sink The sink to add
	 * @param configure Configure the specified sink
	 */
	public WriteTo<TSink extends ILogEventSink>(sink: TSink, configure?: (value: Omit<TSink, "Emit">) => void) {
		configure?.(sink);
		this.sinks.push(sink);
		return this;
	}

	/**
	 * Adds a callback based sink
	 * @param sinkCallback The sink callback
	 */
	public WriteToCallback(sinkCallback: LogEventSinkCallback, configure?: (value: ILogEventCallbackSink) => void) {
		const sink = new LogEventCallbackSink(sinkCallback);
		configure?.(sink);
		this.sinks.push(sink);
		return this;
	}

	/**
	 * Adds an "enricher", which adds extra properties to a log event.
	 */
	public Enrich(enricher: ILogEventEnricher) {
		if (typeIs(enricher, "function")) {
		} else {
			this.enrichers.push(enricher);
		}

		return this;
	}

	/**
	 * Adds a static property value to each message
	 * @param propertyName The property name
	 * @param value The value of the property
	 */
	public EnrichWithProperty<V extends defined>(
		propertyName: string,
		value: V,
		configure?: (enricher: ConfigureOnly<LogEventPropertyEnricher<any>>) => void,
	) {
		return this.EnrichWithProperties(
			{
				[propertyName]: value,
			},
			configure,
		);
	}

	/**
	 * Adds static property values to each message
	 * @param props The properties to add to this logger
	 */
	public EnrichWithProperties<TProps extends { [P in string]: defined }>(
		props: TProps,
		configure?: (enricher: ConfigureOnly<LogEventPropertyEnricher<TProps>>) => void,
	) {
		const enricher = new LogEventPropertyEnricher(props);
		configure?.(enricher);
		this.enrichers.push(enricher);
		return this;
	}

	/**
	 * Sets the minimum log level
	 * @param logLevel The minimum log level to display
	 */
	public SetMinLogLevel(logLevel: LogLevel) {
		this.logLevel = logLevel;
		return this;
	}

	public Create() {
		this.logger._setSinks(this.sinks);
		this.logger._setEnrichers(this.enrichers);
		this.logger._setMinLogLevel(this.logLevel);
		return this.logger;
	}
}
