-- Compiled with roblox-ts v1.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local MessageTemplateParser = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "MessageTemplateParser").MessageTemplateParser
local test = MessageTemplateParser.Parse("Hello, {Name}! How is your {TimeOfDay}?")
local hour = DateTime.fromUnixTimestamp(os.time()):ToLocalTime().Hour
print(test:Render({
	Name = "Vorlias",
	TimeOfDay = (hour < 6 or hour > 16) and "Night" or "Day",
}))
