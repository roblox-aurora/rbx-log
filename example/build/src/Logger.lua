-- Compiled with roblox-ts v1.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local _0 = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "Configuration")
local LogConfiguration = _0.LogConfiguration
local LogLevel = _0.LogLevel
local Logger
do
	Logger = setmetatable({}, {
		__tostring = function()
			return "Logger"
		end,
	})
	Logger.__index = Logger
	function Logger.new(...)
		local self = setmetatable({}, Logger)
		self:constructor(...)
		return self
	end
	function Logger:constructor()
		self.minLogLevel = LogLevel.Information
		self.sinks = {}
	end
	function Logger:_setSinks(sinks)
		self.sinks = sinks
	end
	function Logger:_setMinLogLevel(logLevel)
		self.minLogLevel = logLevel
	end
	function Logger:Configure()
		return LogConfiguration.new(self)
	end
	function Logger:default()
		return self.defaultLogger
	end
	function Logger:Info(template, ...)
		local args = { ... }
		if self.minLogLevel > LogLevel.Information then
			return nil
		end
		for _, sink in ipairs(self.sinks) do
			sink({
				Level = LogLevel.Information,
				Template = template,
				Time = os.time(),
			})
		end
	end
	function Logger:Debug(template, ...)
		local args = { ... }
		if self.minLogLevel > LogLevel.Debugging then
			return nil
		end
		for _, sink in ipairs(self.sinks) do
			sink({
				Level = LogLevel.Information,
				Template = template,
				Time = os.time(),
			})
		end
	end
	function Logger:Warn(template, ...)
		local args = { ... }
		if self.minLogLevel > LogLevel.Warning then
			return nil
		end
		for _, sink in ipairs(self.sinks) do
			sink({
				Level = LogLevel.Information,
				Template = template,
				Time = os.time(),
			})
		end
	end
	function Logger:Error(template, ...)
		local args = { ... }
		if self.minLogLevel > LogLevel.Error then
			return nil
		end
		for _, sink in ipairs(self.sinks) do
			sink({
				Level = LogLevel.Information,
				Template = template,
				Time = os.time(),
			})
		end
	end
	Logger.defaultLogger = Logger.new()
end
return {
	default = Logger,
}
