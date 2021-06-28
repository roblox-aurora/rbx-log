export enum TemplateTokenKind {
	Text,
	Property,
}

export enum DestructureMode {
	Default,
	ToString,
	Destructure,
}

export interface Tokens {
	[TemplateTokenKind.Text]: TextToken;
	[TemplateTokenKind.Property]: PropertyToken;
}

export interface TextToken {
	kind: TemplateTokenKind.Text;
	text: string;
}

export interface PropertyToken {
	kind: TemplateTokenKind.Property;
	destructureMode: DestructureMode;
	propertyName: string;
}

export type Token = Tokens[keyof Tokens];

export function createNode<K extends keyof Tokens>(prop: Tokens[K]) {
	return prop;
}
