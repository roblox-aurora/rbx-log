-- Compiled with roblox-ts v1.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local _0 = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "MessageTemplateToken")
local DestructureMode = _0.DestructureMode
local TemplateTokenKind = _0.TemplateTokenKind
local MessageTemplateParser = {}
do
	local _1 = MessageTemplateParser
	local parseText, parseProperty
	local function Tokenize(messageTemplate)
		return TS.generator(function()
			if #messageTemplate == 0 then
				local _2 = {
					kind = TemplateTokenKind.Text,
					text = "",
				}
				coroutine.yield(_2)
				return nil
			end
			local nextIndex = 0
			while true do
				local startIndex = nextIndex
				local textToken
				local _2 = parseText(nextIndex, messageTemplate)
				nextIndex = _2[1]
				textToken = _2[2]
				if nextIndex > startIndex then
					coroutine.yield(textToken)
				end
				if nextIndex >= #messageTemplate then
					break
				end
				startIndex = nextIndex
				local propertyToken
				local _3 = parseProperty(nextIndex, messageTemplate)
				nextIndex = _3[1]
				propertyToken = _3[2]
				if startIndex < nextIndex then
					coroutine.yield(propertyToken)
				end
				if nextIndex > #messageTemplate then
					break
				end
			end
		end)
	end
	_1.Tokenize = Tokenize
	function parseText(startAt, messageTemplate)
		local results = {}
		repeat
			do
				local _2 = messageTemplate
				local _3 = startAt
				local _4 = startAt
				local char = string.sub(_2, _3, _4)
				if char == "{" then
					local _5 = messageTemplate
					local _6 = startAt + 1
					local _7 = startAt + 1
					local nextChar = string.sub(_5, _6, _7)
					if nextChar == "{" then
						local _8 = results
						local _9 = char
						-- ▼ Array.push ▼
						_8[#_8 + 1] = _9
						-- ▲ Array.push ▲
					else
						break
					end
				else
					local _5 = results
					local _6 = char
					-- ▼ Array.push ▼
					_5[#_5 + 1] = _6
					-- ▲ Array.push ▲
					local _7 = messageTemplate
					local _8 = startAt + 1
					local _9 = startAt + 1
					local nextChar = string.sub(_7, _8, _9)
					if char == "}" then
						if nextChar == "}" then
							startAt += 1
						end
					end
				end
				startAt += 1
			end
		until not (startAt <= #messageTemplate)
		local _2 = {
			kind = TemplateTokenKind.Text,
		}
		local _3 = "text"
		-- ▼ ReadonlyArray.join ▼
		local _4 = ""
		if _4 == nil then
			_4 = ", "
		end
		-- ▲ ReadonlyArray.join ▲
		_2[_3] = table.concat(results, _4)
		return { startAt, _2 }
	end
	local function readWhile(startAt, text, condition)
		local result = ""
		while startAt < #text and condition(string.sub(text, startAt, startAt)) do
			local char = string.sub(text, startAt, startAt)
			result ..= char
			startAt += 1
		end
		return { startAt, result }
	end
	local function isValidNameCharacter(char)
		return (string.match(char, "[%w_]")) ~= nil
	end
	local function isValidDestructureHint(char)
		return (string.match(char, "[@$]")) ~= nil
	end
	function parseProperty(index, messageTemplate)
		index += 1
		local propertyName
		local _2 = readWhile(index, messageTemplate, function(c)
			return isValidDestructureHint(c) or (isValidNameCharacter(c) and c ~= "}")
		end)
		index = _2[1]
		propertyName = _2[2]
		if index == #messageTemplate then
			local _3 = {
				kind = TemplateTokenKind.Text,
				text = propertyName,
			}
			return { index, _3 }
		end
		local destructureMode = DestructureMode.Default
		local char = string.sub(propertyName, 1, 1)
		if isValidDestructureHint(char) then
			repeat
				if char == ("@") then
					destructureMode = DestructureMode.Destructure
					break
				end
				if char == ("$") then
					destructureMode = DestructureMode.ToString
					break
				end
				destructureMode = DestructureMode.Default
			until true
			propertyName = string.sub(propertyName, 2)
		end
		local _3 = index + 1
		local _4 = {
			kind = TemplateTokenKind.Property,
			propertyName = propertyName,
			destructureMode = destructureMode,
		}
		return { _3, _4 }
	end
end
return {
	MessageTemplateParser = MessageTemplateParser,
}
