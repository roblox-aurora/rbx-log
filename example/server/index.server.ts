import { MessageTemplateParser } from "./MessageTemplateParser";

for (const value of MessageTemplateParser.Tokenize("Testing lol {@hi} there {Bob} {$} yeet")) {
	print(value);
}
