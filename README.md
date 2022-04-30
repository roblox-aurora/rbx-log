<div align="center">
<img src="https://i.imgur.com/yzq5cEa.png">

_Not associated with BLAMMO ;-)_
</div>

Structured logging library for Roblox, akin to (and inspired by) [serilog](https://github.com/serilog/serilog). It uses the [Message Templates](https://messagetemplates.org/) spec for handling logging.

## Setup
To begin, you will need to install the package. This can be done via
```
npm i @rbxts/log
```

Once installed, to begin logging you will need to configure the logger. (The server/client will need separate configurations, this is the recommended way of doing it)

Basic setup:
```ts
import Log, { Logger } from "@rbxts/log";
Log.SetLogger(
    Logger.configure()
        .WriteTo(Log.RobloxOutput()) // WriteTo takes a sink and writes to it
        .Create() // Creates the logger from the configuration
);

Log.Info("Hello, Log!");
```

The main power of this library comes from the structured event data logging:
```ts
const startPoint = new Vector2(0, 0)
const position = new Vector2(25, 134);
const distance = position.sub(startPoint).Magnitude;

Log.Info("Walked to {@Position}, travelling a distance of {Distance}", position, distance);
```

Log uses [message templates](https://messagetemplates.org/), like serilog and will format strings with _named_ parameters (positional coming soon).

The example above has two properties, `Position` and `Distance`, in the log event the `@` operator in front of position tells Log to _serialize_ the object passed in, rather than using `tostring(value)`. The listed data types this library can serialize is listed below.

Rendered into JSON using `HttpService`, these properties appear alongside the Timestamp, Level and Template like:

```json
{"Position": {"X": 25, "Y": 134}, "Distance": 136.32 }
```

The structured nature of the data means that it is easily searched and filtered by external tools (as well as roblox-based libraries like `Zircon`)

Of course, this data can be logged to the roblox console or another supported console directly if need be, the default Roblox Output sink for example displays the above as such:
```
08:29:20 [INF] Walked to {"X": 25, "Y": 134}, travelling a distance of 136.32
```

## Features
- Level-based logging, with levels like `Debug`, `Information`, `Warning` and `Error`.
- Support for custom sinks, like logging to your own external server or to a console like the roblox output and Zircon.
- The ability to enrich logging events using `EnrichWithProperty` or `Enrich`. E.g. add the version to your logging events:
    ```ts
    Log.SetLogger(
        Logger.configure()
            // ...
            .EnrichWithProperty("Version", PKG_VERSION) // Will add "Version" to the event data
            // ...
            .Create()
    );
    ```
- A global `Log` object, with the ability to create individual `Logger` objects.

## Supported Sinks
| Sink Name | Via | Information |
|--------|-------------|----------|
| Roblox Output | `Log.RobloxOutput()` | Built in sink which will write to the output + dev console |
| [Zircon](https://github.com/roblox-aurora/zircon) | `Zircon.Log.Console()` | Runtime Debugging Console for Roblox |
