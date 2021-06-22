-- Compiled with roblox-ts v1.0.0
local TemplateTokenKind
do
	local _0 = {}
	TemplateTokenKind = setmetatable({}, {
		__index = _0,
	})
	TemplateTokenKind.Text = 0
	_0[0] = "Text"
	TemplateTokenKind.Property = 1
	_0[1] = "Property"
end
local DestructureMode
do
	local _0 = {}
	DestructureMode = setmetatable({}, {
		__index = _0,
	})
	DestructureMode.Default = 0
	_0[0] = "Default"
	DestructureMode.ToString = 1
	_0[1] = "ToString"
	DestructureMode.Destructure = 2
	_0[2] = "Destructure"
end
local function createNode(prop)
	return prop
end
return {
	createNode = createNode,
	TemplateTokenKind = TemplateTokenKind,
	DestructureMode = DestructureMode,
}
