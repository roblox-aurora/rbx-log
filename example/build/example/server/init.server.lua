-- Compiled with roblox-ts v1.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local MessageTemplateParser = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "MessageTemplateParser").MessageTemplateParser
for _0 in MessageTemplateParser.Tokenize("Testing lol {@hi} there {Bob} {$} yeet").next do
	if _0.done then
		break
	end
	local value = _0.value
	print(value)
end
