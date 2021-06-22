-- Compiled with roblox-ts v1.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local _0 = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "Configuration")
local LogConfiguration = _0.LogConfiguration
local LogLevel = _0.LogLevel
local Logger = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "Logger").default
local Log = {}
do
	local _1 = Log
	local defaultLogger = Logger:default()
	local function Configure()
		return LogConfiguration.new(defaultLogger)
	end
	_1.Configure = Configure
	local function Create()
		return Logger.new():Configure()
	end
	_1.Create = Create
	local RobloxOutput = function()
		return function(message)
			local time = DateTime.fromUnixTimestamp(os.time()):FormatLocalTime("HH:MM:ss", "en-us")
			local tag
			local _2 = message.Level
			repeat
				if _2 == (LogLevel.Debugging) then
					tag = "DBG"
					break
				end
				if _2 == (LogLevel.Information) then
					tag = "INF"
					break
				end
				if _2 == (LogLevel.Warning) then
					tag = "WRN"
					break
				end
				if _2 == (LogLevel.Error) then
					tag = "ERR"
					break
				end
			until true
			if message.Level >= LogLevel.Warning then
				warn(time, "[" .. tag .. "]", message.Template)
			else
				print(time, "[" .. tag .. "]", message.Template)
			end
		end
	end
	_1.RobloxOutput = RobloxOutput
	local function Info(template, ...)
		local args = { ... }
		defaultLogger:Info(template, unpack(args))
	end
	_1.Info = Info
	local function Debug(template, ...)
		local args = { ... }
		defaultLogger:Debug(template, unpack(args))
	end
	_1.Debug = Debug
	local function Warn(template, ...)
		local args = { ... }
		defaultLogger:Warn(template, unpack(args))
	end
	_1.Warn = Warn
	local function Error(template, ...)
		local args = { ... }
		defaultLogger:Error(template, unpack(args))
	end
	_1.Error = Error
end
return Log
