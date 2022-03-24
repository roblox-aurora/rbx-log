import { LogEvent } from "index";

type SystemDefinedLogPropertyKeys = "Level" | "Template" | "Timestamp";

type EnforceNoSystemProps = { readonly [P in SystemDefinedLogPropertyKeys]?: never };
export type EnforceUserKey<T> = Exclude<T, SystemDefinedLogPropertyKeys>;

export type UserDefinedLogProperties = { [P in string]: defined } &
	Partial<Pick<LogEvent, "SourceContext">> &
	EnforceNoSystemProps;
