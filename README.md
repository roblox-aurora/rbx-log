# Log
Structured logger for Roblox based on [serilog](https://github.com/serilog/serilog) using the [Message Templates](https://messagetemplates.org/) spec. The goal of this library is to give a diagnostic logging library for Roblox games, that uses a structured logging system that can be consumed by different systems, such as consoles and web servers.

## Logging

To begin, you need to initialize a sink for the logger to log to.

```ts
import Log, {LogLevel} from "@rbxts/log";
// If the logger is not configured, it will not emit anyt
Log.SetLogger(new LoggerConfiguration()
    .WriteTo(Log.RobloxOutput())
    .SetMinLogLevel(LogLevel.Information)
    .CreateLogger());

Log.Info("Hello, World!") // will print `08:00 PM [INFO] Hello, World!`

const sound = "woof!";
Log.Info("The dog says {sound}", sound) // `08:00 PM [INFO] The dog says woof!`

// You can also log complex structures such as arrays
Log.Info("My array is {@Names}", ["Steve", "John"])
// 08:00 PM [INFO] My array is ["Steve", "John"]
```

## Supported sinks
- ### Roblox output (via `Log.Output`)
- ### [Zircon](https://github.com/roblox-aurora/zircon) (coming soon&trade;)

## Writing your own sink
A `sink` in `Log` is just a function that takes an object passed by the library.

Examples of the objects:
```ts
Log.Info("Hello, World!")
```
```json
{
    "Level": 1, 
    "Time": 1624349445, // UNIX TIMESTAMP
    "Template": "Hello, World!"
}
```

```ts
Log.Info("Hello {Name}! Numbers: {@Numbers}", "Reader", [10, 20, 30])
```
```json
{
    "Level": 1, 
    "Time": 1624349445, // UNIX TIMESTAMP
    "Template": "Hello {Name}! Numbers: {@Numbers}",
    // Additional user fields:
    "Name": "Reader",
    "Numbers": [10, 20, 30]
}
```

So, using this knowledge; `Log.Output` is:

```ts
const Output = (sink: Message) => {
    const time = DateTime.fromUnixTimestamp(os.time()).FormatLocalTime("HH:MM:ss", "en-us");
    let tag: string;
    switch (sink.Level) {
        case LogLevel.Debugging:
            tag = "DBG";
            break;
        case LogLevel.Information:
            tag = "INF";
            break;
        case LogLevel.Warning:
            tag = "WRN";
            break;
        case LogLevel.Error:
            tag = "ERR";
            break;
    }

     print(time, `${tag}`, MessageTemplate.PlainText(sink.Template, sink));
}
```