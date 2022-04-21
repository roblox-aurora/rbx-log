import { UserDefinedLogProperties } from "./Core/TypeUtils";
import { LogConfiguration } from "./Configuration";
import { LogEventRobloxOutputSink, RobloxOutputOptions } from "./Core/LogEventRobloxOutputSink";
import { Logger, LoggerContext } from "./Logger";
import { LogLevel } from "./Core";
export { Logger } from "./Logger";
export { LogLevel, LogEvent } from "./Core";

namespace Log {
	let defaultLogger: Logger = Logger.default();

	export function SetLogger(logger: Logger) {
		defaultLogger = logger;
	}

	export function Default() {
		return defaultLogger;
	}

	/**
	 * Configure a custom logger
	 */
	export function Configure() {
		return Logger.configure();
	}

	/**
	 * Creates a custom logger
	 * @returns The logger configuration, use `Initialize` to get the logger once configured
	 * @deprecated Use {@link Configure}. This will be removed in future.
	 */
	export const Create = Configure;

	/**
	 * The default roblox output sink
	 * @param options Options for the sink
	 */
	export const RobloxOutput = (options: RobloxOutputOptions = {}) => new LogEventRobloxOutputSink(options);

	/**
	 * Write a "Fatal" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Fatal(template: string, ...args: unknown[]) {
		return defaultLogger.Fatal(template, ...args);
	}

	/**
	 * Write a "Verbose" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Verbose(template: string, ...args: unknown[]) {
		defaultLogger.Verbose(template, ...args);
	}

	/**
	 * Write an "Information" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Info(template: string, ...args: unknown[]) {
		defaultLogger.Info(template, ...args);
	}

	/**
	 * Write a "Debugging" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Debug(template: string, ...args: unknown[]) {
		defaultLogger.Debug(template, ...args);
	}

	/**
	 * Write a "Warning" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Warn(template: string, ...args: unknown[]) {
		defaultLogger.Warn(template, ...args);
	}

	/**
	 * Write an "Error" message to the default logger
	 * @param template
	 * @param args
	 */
	export function Error(template: string, ...args: unknown[]) {
		return defaultLogger.Error(template, ...args);
	}

	/**
	 * Creates a logger that enriches log events with the specified context as the property `SourceContext`.
	 * @param context The tag to use
	 */
	export function ForContext(
		context: LoggerContext,
		contextConfiguration?: (configuration: Omit<LogConfiguration, "Create">) => void,
	) {
		return defaultLogger.ForContext(context, contextConfiguration);
	}

	/**
	 * Creates a logger that nriches log events with the specified property
	 * @param name The name of the property
	 * @param value The value of the property
	 */
	export function ForProperty<K extends keyof UserDefinedLogProperties>(name: K, value: UserDefinedLogProperties[K]) {
		return defaultLogger.ForProperty(name, value);
	}

	/**
	 * Creates a logger that enriches log events with the specified properties
	 * @param props The properties
	 */
	export function ForProperties<TProps extends UserDefinedLogProperties>(props: TProps) {
		return defaultLogger.ForProperties(props);
	}

	/**
	 * Creates a logger that enriches log events with the `SourceContext` as the containing script
	 */
	export function ForScript(scriptContextConfiguration?: (configuration: Omit<LogConfiguration, "Create">) => void) {
		// Unfortunately have to duplicate here, since `debug.info`.
		const [s] = debug.info(2, "s");
		const copy = defaultLogger.Copy();
		scriptContextConfiguration?.(copy);
		return copy
			.EnrichWithProperties({
				SourceContext: s,
				SourceKind: "Script",
			})
			.Create();
	}

	/**
	 * Set the minimum log level for the default logger
	 */
	export function SetMinLogLevel(logLevel: LogLevel) {
		defaultLogger.SetMinLogLevel(logLevel);
	}

	/**
	 * Creates a logger that enriches log events with `SourceContext` as the specified function
	 */
	export function ForFunction(
		func: () => void,
		funcContextConfiguration?: (configuration: Omit<LogConfiguration, "Create">) => void,
	) {
		return defaultLogger.ForFunction(func, funcContextConfiguration);
	}
}
export default Log;
