import Log from "@rbxts/log";
import { LogConfiguration } from "./Configuration";
import { MessageTemplateParser } from "./MessageTemplateParser";

const test = MessageTemplateParser.Parse("Hello, {Name}! How is your {TimeOfDay}?");

const hour = DateTime.fromUnixTimestamp(os.time()).ToLocalTime().Hour;
print(
	test.Render({
		Name: "Vorlias",
		TimeOfDay: hour < 6 || hour > 16 ? "Night" : "Day",
	}),
);

Log.SetLogger(
	new LogConfiguration().WriteTo(Log.RobloxOutput()).EnrichWithProperty("Version", PKG_VERSION).CreateLogger(),
);
Log.Info("Hello, Vorlias!", "");
