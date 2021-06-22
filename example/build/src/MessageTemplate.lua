-- Compiled with roblox-ts v1.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("TS"):WaitForChild("RuntimeLib"))
local _0 = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "node_modules", "net", "MessageTemplateToken")
local DestructureMode = _0.DestructureMode
local TemplateTokenKind = _0.TemplateTokenKind
local HttpService = game:GetService("HttpService")
local MessageTemplate
do
	MessageTemplate = setmetatable({}, {
		__tostring = function()
			return "MessageTemplate"
		end,
	})
	MessageTemplate.__index = MessageTemplate
	function MessageTemplate.new(...)
		local self = setmetatable({}, MessageTemplate)
		self:constructor(...)
		return self
	end
	function MessageTemplate:constructor(template, tokens)
		self.template = template
		self.tokens = tokens
		local _1 = tokens
		local _2 = function(f)
			return f.kind == TemplateTokenKind.Property
		end
		-- ▼ ReadonlyArray.filter ▼
		local _3 = {}
		local _4 = 0
		for _5, _6 in ipairs(_1) do
			if _2(_6, _5 - 1, _1) == true then
				_4 += 1
				_3[_4] = _6
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		self.properties = _3
	end
	function MessageTemplate:GetTokens()
		return self.tokens
	end
	function MessageTemplate:GetProperties()
		return self.properties
	end
	function MessageTemplate:GetText()
		return self.template
	end
	function MessageTemplate:Render(properties)
		local result = ""
		for _, token in ipairs(self.tokens) do
			local _1 = token.kind
			repeat
				local _2 = false
				if _1 == (TemplateTokenKind.Text) then
					result ..= token.text
					break
				end
				if _1 == (TemplateTokenKind.Property) then
					local prop = properties[token.propertyName]
					if token.destructureMode == DestructureMode.ToString then
						result ..= tostring(prop)
					elseif token.destructureMode == DestructureMode.Destructure then
						result ..= HttpService:JSONEncode(prop)
					else
						local _3 = prop
						local _4 = prop
						if typeof(_3) == "Instance" then
							result ..= prop:GetFullName()
						elseif type(_4) == "table" then
							result ..= HttpService:JSONEncode(prop)
						else
							result ..= tostring(prop)
						end
					end
				end
			until true
		end
		return result
	end
end
return {
	MessageTemplate = MessageTemplate,
}
