--[[
    Luau exports file for Log
]]
type void = nil
type LogEnricher = {}

type LogEvent = {
    Level: LogLevel,
    Timestamp: string,
    SourceContext: string?,
    Template: string,
    [string]: any?,
}
type LogLevel = number
type LogSink = {
    Emit: (self: LogSink, message: LogEvent) -> void
}

type Constructor = { new: (...any) -> any }
type ToString = { toString: () -> string }
type LoggerContext = Constructor | ToString | Instance

type Logger = {
    Write: (self: Logger, logLevel: LogLevel, template: string, ...any) -> void,
    Info: (self: Logger, template: string, ...any) -> void,
    Warn: (self: Logger, template: string, ...any) -> void,
    Error: (self: Logger, template: string, ...any) -> string,
    Fatal: (self: Logger, template: string, ...any) -> string,
    Debug: (self: Logger, template: string, ...any) -> void,
    Verbose: (self: Logger, template: string, ...any) -> void,
    ForContext: (self: Logger, context: LoggerContext) -> Logger,
    ForScript: (self: Logger) -> Logger,
    ForFunction: (self: Logger, fn: () -> void) -> Logger,
    ForProperty: (self: Logger, name: string, value: any) -> Logger,
}
type LogConfiguration = {
    WriteTo: (self: LogConfiguration, sink: LogSink, configure: ((sink: LogSink) -> void)?) -> LogConfiguration,
    WriteToCallback: (self: LogConfiguration, sinkCallback: () -> void) -> LogConfiguration,
    Enrich: (self: LogConfiguration, enricher: LogEnricher) -> LogConfiguration,
    EnrichWithProperty: (self: LogConfiguration, propertyName: string, value: any) -> LogConfiguration,
    SetMinLogLevel: (self: LogConfiguration, minLogLevel: LogLevel) -> LogConfiguration,
    Create: (self: LogConfiguration) -> Logger
}

type LogLevelEnum = {
    [LogLevel]: string,
    Verbose: LogLevel,
    Debugging: LogLevel,
    Information: LogLevel,
    Warning: LogLevel,
    Error: LogLevel,
    Fatal: LogLevel
}

type LogNamespace = {
    RobloxOutput: () -> LogSink,
    SetLogger: (logger: Logger) -> void,
    Default: () -> Logger,
    Create: () -> LogConfiguration,
    Level: LogLevelEnum,

    Info: (template: string, ...any) -> void,
    Warn: (template: string, ...any) -> void,
    Error: (template: string, ...any) -> string,
    Fatal: (template: string, ...any) -> string,
    Debug: (template: string, ...any) -> void,
    Verbose: (template: string, ...any) -> void,
    ForContext: (context: LoggerContext) -> Logger,
    ForScript: () -> Logger,
    ForFunction: (fn: () -> void) -> Logger,
    ForProperty: (name: string, value: any) -> Logger,
}
export type Log = LogNamespace;

-- Compiled with roblox-ts v1.3.3
local TS = require(script.TS.RuntimeLib)
local exports = {}
local LogEventRobloxOutputSink = TS.import(script, script, "Core", "LogEventRobloxOutputSink").LogEventRobloxOutputSink
local Logger = TS.import(script, script, "Logger").Logger
exports.Logger = TS.import(script, script, "Logger").Logger
exports.LogLevel = TS.import(script, script, "Core").LogLevel
local Log = {}
do
	local _container = Log
	local defaultLogger = Logger:default()
	local function SetLogger(logger)
		defaultLogger = logger
	end
	_container.SetLogger = SetLogger
	local function Default()
		return defaultLogger
	end
	_container.Default = Default
	--[[
		*
		* Configure a custom logger
	]]
	local function Configure()
		return Logger:configure()
	end
	_container.Configure = Configure
	--[[
		*
		* Creates a custom logger
		* @returns The logger configuration, use `Initialize` to get the logger once configured
		* @deprecated Use {@link Configure}. This will be removed in future.
	]]
	local Create = Configure
	_container.Create = Create
	--[[
		*
		* The default roblox output sink
		* @param options Options for the sink
	]]
	local RobloxOutput = function(options)
		if options == nil then
			options = {}
		end
		return LogEventRobloxOutputSink.new(options)
	end
	_container.RobloxOutput = RobloxOutput
	--[[
		*
		* Write a "Fatal" message to the default logger
		* @param template
		* @param args
	]]
	local function Fatal(template, ...)
		local args = { ... }
		return defaultLogger:Fatal(template, unpack(args))
	end
	_container.Fatal = Fatal
	--[[
		*
		* Write a "Verbose" message to the default logger
		* @param template
		* @param args
	]]
	local function Verbose(template, ...)
		local args = { ... }
		defaultLogger:Verbose(template, unpack(args))
	end
	_container.Verbose = Verbose
	--[[
		*
		* Write an "Information" message to the default logger
		* @param template
		* @param args
	]]
	local function Info(template, ...)
		local args = { ... }
		defaultLogger:Info(template, unpack(args))
	end
	_container.Info = Info
	--[[
		*
		* Write a "Debugging" message to the default logger
		* @param template
		* @param args
	]]
	local function Debug(template, ...)
		local args = { ... }
		defaultLogger:Debug(template, unpack(args))
	end
	_container.Debug = Debug
	--[[
		*
		* Write a "Warning" message to the default logger
		* @param template
		* @param args
	]]
	local function Warn(template, ...)
		local args = { ... }
		defaultLogger:Warn(template, unpack(args))
	end
	_container.Warn = Warn
	--[[
		*
		* Write an "Error" message to the default logger
		* @param template
		* @param args
	]]
	local function Error(template, ...)
		local args = { ... }
		return defaultLogger:Error(template, unpack(args))
	end
	_container.Error = Error
	--[[
		*
		* Creates a logger that enriches log events with the specified context as the property `SourceContext`.
		* @param context The tag to use
	]]
	local function ForContext(context, contextConfiguration)
		return defaultLogger:ForContext(context, contextConfiguration)
	end
	_container.ForContext = ForContext
	--[[
		*
		* Creates a logger that nriches log events with the specified property
		* @param name The name of the property
		* @param value The value of the property
	]]
	local function ForProperty(name, value)
		return defaultLogger:ForProperty(name, value)
	end
	_container.ForProperty = ForProperty
	--[[
		*
		* Creates a logger that enriches log events with the specified properties
		* @param props The properties
	]]
	local function ForProperties(props)
		return defaultLogger:ForProperties(props)
	end
	_container.ForProperties = ForProperties
	--[[
		*
		* Creates a logger that enriches log events with the `SourceContext` as the containing script
	]]
	local function ForScript(scriptContextConfiguration)
		-- Unfortunately have to duplicate here, since `debug.info`.
		local s = debug.info(2, "s")
		local copy = defaultLogger:Copy()
		local _result = scriptContextConfiguration
		if _result ~= nil then
			_result(copy)
		end
		return copy:EnrichWithProperties({
			SourceContext = s,
			SourceKind = "Script",
		}):Create()
	end
	_container.ForScript = ForScript
	--[[
		*
		* Set the minimum log level for the default logger
	]]
	local function SetMinLogLevel(logLevel)
		defaultLogger:SetMinLogLevel(logLevel)
	end
	_container.SetMinLogLevel = SetMinLogLevel
	--[[
		*
		* Creates a logger that enriches log events with `SourceContext` as the specified function
	]]
	local function ForFunction(func, funcContextConfiguration)
		return defaultLogger:ForFunction(func, funcContextConfiguration)
	end
	_container.ForFunction = ForFunction
end

Log.LogLevel = exports.LogLevel
Log.Logger = exports.Logger
return Log :: Log