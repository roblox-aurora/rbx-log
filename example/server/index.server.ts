import Log, { Logger, LogLevel } from "@rbxts/log";
import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";

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
		.EnrichWithProperty("Version", PKG_VERSION)
		.EnrichWithProperty("Test", 10, (c) => c.SetMinLogLevel(LogLevel.Fatal))
		.WriteTo(Log.RobloxOutput())
		.WriteToCallback((message) => print(message))
		.Create(),
);
Log.Info("Basic message with no arguments");
Log.Info("Basic message using tag with no arguments {Woops}!");
Log.Info("Hello, {Name}! {@AnArray}", "Vorlias", [1, 2, 3, 4]);
