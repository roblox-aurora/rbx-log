import { DestructureMode, PropertyToken, TemplateTokenKind, Token } from "./MessageTemplateToken";
const HttpService = game.GetService("HttpService");

export class MessageTemplate {
	private properties: readonly PropertyToken[];
	constructor(private template: string, private tokens: readonly Token[]) {
		this.properties = tokens.filter((f): f is PropertyToken => f.kind === TemplateTokenKind.Property);
	}

	public GetTokens() {
		return this.tokens;
	}

	public GetProperties() {
		return this.properties;
	}

	public GetText() {
		return this.template;
	}

	// /**
	//  * Renders the template in plain text based on the given properties
	//  * @param properties
	//  * @returns
	//  */
	// public Render(properties: Record<string, defined>) {
	// 	let result = "";
	// 	for (const token of this.tokens) {
	// 		switch (token.kind) {
	// 			case TemplateTokenKind.Text:
	// 				result += token.text;
	// 				break;
	// 			case TemplateTokenKind.Property:
	// 				const prop = properties[token.propertyName];

	// 				if (token.destructureMode === DestructureMode.ToString) {
	// 					result += tostring(prop);
	// 				} else if (token.destructureMode === DestructureMode.Destructure) {
	// 					result += HttpService.JSONEncode(prop);
	// 				} else {
	// 					if (typeIs(prop, "Instance")) {
	// 						result += prop.GetFullName();
	// 					} else if (typeIs(prop, "table")) {
	// 						result += HttpService.JSONEncode(prop);
	// 					} else {
	// 						result += tostring(prop);
	// 					}
	// 				}
	// 		}
	// 	}
	// 	return result;
	// }
}
