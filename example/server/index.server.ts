import Log, { Logger } from "@rbxts/log";
import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";
import { LogConfiguration } from "./Configuration";

const test = MessageTemplateParser.GetTokens("Hello, {Name}! How is your {TimeOfDay}?");
const result = new PlainTextMessageTemplateRenderer(test);

const hour = DateTime.fromUnixTimestamp(os.time()).ToLocalTime().Hour;
print(
	result.Render({
		Name: "Vorlias",
		TimeOfDay: hour < 6 || hour > 16 ? "Night" : "Day",
	}),
);

Log.SetLogger(
	Logger.configure()
		.WriteTo(
			Log.RobloxOutput({
				TagFormat: "full",
			}),
		)
		.WriteTo((message) => print(message))
		.EnrichWithProperty("Version", PKG_VERSION)
		.Create(),
);
Log.Info("Basic message with no arguments");
Log.Info("Basic message using tag with no arguments {Woops}!");
Log.Info("Hello, {Name}! {@AnArray}", "Vorlias", [1, 2, 3, 4]);
