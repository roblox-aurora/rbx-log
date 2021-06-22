import { MessageTemplateParser } from "./MessageTemplateParser";

const test = MessageTemplateParser.Parse("Hello, {Name}! How is your {TimeOfDay}?");

const hour = DateTime.fromUnixTimestamp(os.time()).ToLocalTime().Hour;
print(test.Render({
    Name: "Vorlias",
    TimeOfDay: hour < 6 || hour > 16 ? "Night" : "Day",
}));