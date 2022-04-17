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

local Log = {} :: Log

local LogCore = require(script.dist)
local LogLevel = require(script.dist.Core).LogLevel

for k, v in pairs(LogCore) do
    Log[k] = v
end
Log.LogLevel = LogLevel

return Log