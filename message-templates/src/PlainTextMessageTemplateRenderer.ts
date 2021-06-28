import { DestructureMode, PropertyToken, TextToken } from "MessageTemplateToken";
import { MessageTemplateRenderer } from "./MessageTemplateRenderer";
const HttpService = game.GetService("HttpService");

export class PlainTextMessageTemplateRenderer extends MessageTemplateRenderer {
	protected RenderPropertyToken(propertyToken: PropertyToken, value: unknown): string {
		if (propertyToken.destructureMode === DestructureMode.ToString) {
			return tostring(value);
		} else if (propertyToken.destructureMode === DestructureMode.Destructure) {
			return HttpService.JSONEncode(value);
		} else {
			if (typeIs(value, "Instance")) {
				return value.GetFullName();
			} else if (typeIs(value, "table")) {
				return HttpService.JSONEncode(value);
			} else {
				return tostring(value);
			}
		}
	}
	protected RenderTextToken(textToken: TextToken): string {
		return textToken.text;
	}
}
