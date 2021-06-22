import {
	createNode,
	DestructureMode,
	PropertyToken,
	TemplateTokenKind,
	TextToken,
	Token,
} from "./MessageTemplateToken";

export namespace MessageTemplateParser {
	export function* Tokenize(messageTemplate: string): Generator<Token, void, unknown> {
		if (messageTemplate.size() === 0) {
			yield identity<TextToken>({ kind: TemplateTokenKind.Text, text: "" });
			return;
		}

		let nextIndex = 0;
		while (true) {
			let startIndex = nextIndex;
			let textToken: TextToken;
			[nextIndex, textToken] = parseText(nextIndex, messageTemplate);

			if (nextIndex > startIndex) {
				yield textToken;
			}

			if (nextIndex >= messageTemplate.size()) break;

			startIndex = nextIndex;
			let propertyToken: PropertyToken | TextToken | undefined;
			[nextIndex, propertyToken] = parseProperty(nextIndex, messageTemplate);

			if (startIndex < nextIndex) {
				yield propertyToken;
			}

			if (nextIndex > messageTemplate.size()) {
				break;
			}
		}
	}

	function parseText(startAt: number, messageTemplate: string) {
		const results = new Array<string>();
		do {
			const char = messageTemplate.sub(startAt, startAt);
			if (char === "{") {
				const nextChar = messageTemplate.sub(startAt + 1, startAt + 1);
				if (nextChar === "{") {
					results.push(char);
				} else {
					break;
				}
			} else {
				results.push(char);

				const nextChar = messageTemplate.sub(startAt + 1, startAt + 1);
				if (char === "}") {
					if (nextChar === "}") {
						startAt++;
					}
				}
			}
			startAt++;
		} while (startAt <= messageTemplate.size());
		return [startAt, identity<TextToken>({ kind: TemplateTokenKind.Text, text: results.join("") })] as const;
	}

	function readWhile(startAt: number, text: string, condition: (char: string) => boolean) {
		let result = "";
		while (startAt < text.size() && condition(string.sub(text, startAt, startAt))) {
			const char = string.sub(text, startAt, startAt);
			result += char;
			startAt++;
		}

		return [startAt, result] as const;
	}

	function isValidNameCharacter(char: string) {
		return char.match("[%w_]")[0] !== undefined;
	}

	function isValidDestructureHint(char: string) {
		return char.match("[@$]")[0] !== undefined;
	}

	function parseProperty(index: number, messageTemplate: string): [number, PropertyToken | TextToken] {
		index++; // Skip {

		let propertyName: string;
		[index, propertyName] = readWhile(
			index,
			messageTemplate,
			(c) => isValidDestructureHint(c) || (isValidNameCharacter(c) && c !== "}"),
		);

		if (index === messageTemplate.size()) {
			return [index, identity<TextToken>({ kind: TemplateTokenKind.Text, text: propertyName })];
		}

		let destructureMode = DestructureMode.Default;
		const char = propertyName.sub(1, 1);
		if (isValidDestructureHint(char)) {
			switch (char) {
				case "@":
					destructureMode = DestructureMode.Destructure;
					break;
				case "$":
					destructureMode = DestructureMode.ToString;
					break;
				default:
					destructureMode = DestructureMode.Default;
			}
			propertyName = propertyName.sub(2);
		}

		return [
			index + 1, // skip }
			identity<PropertyToken>({ kind: TemplateTokenKind.Property, propertyName, destructureMode }),
		];
	}
}
