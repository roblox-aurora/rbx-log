import { PropertyToken, TemplateTokenKind, TextToken, Token } from "MessageTemplateToken";

export abstract class MessageTemplateRenderer {
	public constructor(private tokens: Token[]) {}
	public Render(properties: Record<string, defined>): string {
		let result = "";
		for (const token of this.tokens) {
			switch (token.kind) {
				case TemplateTokenKind.Property:
					result += this.RenderPropertyToken(token, properties[token.propertyName]);
					break;
				case TemplateTokenKind.Text:
					result += this.RenderTextToken(token);
			}
		}
		return result;
	}
	protected abstract RenderPropertyToken(propertyToken: PropertyToken, value: unknown): string;
	protected abstract RenderTextToken(textToken: TextToken): string;
}
