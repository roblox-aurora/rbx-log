import { DestructureMode, PropertyToken, TextToken } from "MessageTemplateToken";
import { RbxSerializer } from "RbxSerializer";
import { MessageTemplateRenderer } from "./MessageTemplateRenderer";
const HttpService = game.GetService("HttpService");

export class PlainTextMessageTemplateRenderer extends MessageTemplateRenderer {
	protected RenderPropertyToken(propertyToken: PropertyToken, value: unknown): string {
		const serialized = RbxSerializer.Serialize(value, propertyToken.destructureMode);
		if (typeIs(serialized, "table")) {
			return HttpService.JSONEncode(serialized);
		} else {
			return tostring(serialized);
		}
	}
	protected RenderTextToken(textToken: TextToken): string {
		return textToken.text;
	}
}
