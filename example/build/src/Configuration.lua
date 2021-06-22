-- Compiled with roblox-ts v1.0.0
local LogLevel
do
	local _0 = {}
	LogLevel = setmetatable({}, {
		__index = _0,
	})
	LogLevel.Debugging = 0
	_0[0] = "Debugging"
	LogLevel.Information = 1
	_0[1] = "Information"
	LogLevel.Warning = 2
	_0[2] = "Warning"
	LogLevel.Error = 3
	_0[3] = "Error"
end
local LogConfiguration
do
	LogConfiguration = setmetatable({}, {
		__tostring = function()
			return "LogConfiguration"
		end,
	})
	LogConfiguration.__index = LogConfiguration
	function LogConfiguration.new(...)
		local self = setmetatable({}, LogConfiguration)
		self:constructor(...)
		return self
	end
	function LogConfiguration:constructor(logger)
		self.logger = logger
		self.sinks = {}
		self.logLevel = LogLevel.Information
	end
	function LogConfiguration:WriteTo(sink)
		local _0 = self.sinks
		local _1 = sink
		-- ▼ Array.push ▼
		_0[#_0 + 1] = _1
		-- ▲ Array.push ▲
		return self
	end
	function LogConfiguration:SetLogLevel(logLevel)
		self.logLevel = logLevel
	end
	function LogConfiguration:Initialize()
		self.logger:_setSinks(self.sinks)
		return self.logger
	end
end
return {
	LogLevel = LogLevel,
	LogConfiguration = LogConfiguration,
}
