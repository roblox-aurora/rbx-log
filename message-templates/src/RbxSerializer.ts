import { DestructureMode } from "./MessageTemplateToken";

/**
 * Handles serialization of Roblox objects for use in event data
 */
export namespace RbxSerializer {
	const HttpService = game.GetService("HttpService");

	export interface SerializedVector {
		readonly X: number;
		readonly Y: number;
		readonly Z: number;
	}
	export function SerializeVector3(value: Vector3 | Vector3int16): SerializedVector {
		return { X: value.X, Y: value.Y, Z: value.Z };
	}

	export interface SerializedVector2 {
		readonly X: number;
		readonly Y: number;
	}
	export function SerializeVector2(value: Vector2 | Vector2int16): SerializedVector2 {
		return { X: value.X, Y: value.Y };
	}

	export interface SerializedNumberRange {
		readonly Min: number;
		readonly Max: number;
	}
	export function SerializeNumberRange(numberRange: NumberRange): SerializedNumberRange {
		return { Min: numberRange.Min, Max: numberRange.Max };
	}

	export function SerializeDateTime(dateTime: DateTime): string {
		return dateTime.ToIsoDate();
	}

	export function SerializeEnumItem(enumItem: EnumItem): string {
		return tostring(enumItem);
	}

	export interface SerializedUDim {
		readonly Offset: number;
		readonly Scale: number;
	}
	export function SerializeUDim(value: UDim): SerializedUDim {
		return { Offset: value.Offset, Scale: value.Scale };
	}

	export interface SerializedUDim2 {
		readonly X: SerializedUDim;
		readonly Y: SerializedUDim;
	}
	export function SerializeUDim2(value: UDim2): SerializedUDim2 {
		return { X: SerializeUDim(value.X), Y: SerializeUDim(value.Y) };
	}

	export interface SerializedColor3 {
		readonly R: number;
		readonly G: number;
		readonly B: number;
	}
	export function SerializeColor3(color3: Color3) {
		return { R: color3.R, G: color3.G, B: color3.B };
	}

	export function SerializeBrickColor(color: BrickColor) {
		return SerializeColor3(color.Color);
	}

	export interface SerializedRect {
		readonly RectMin: SerializedVector2;
		readonly RectMax: SerializedVector2;
		readonly RectHeight: number;
		readonly RectWidth: number;
	}
	export function SerializeRect(value: Rect): SerializedRect {
		return {
			RectMin: SerializeVector2(value.Min),
			RectMax: SerializeVector2(value.Max),
			RectHeight: value.Height,
			RectWidth: value.Width,
		};
	}

	export interface SerializedPathWaypoint {
		readonly WaypointAction: string;
		readonly WaypointPosition: SerializedVector;
	}
	export function SerializePathWaypoint(value: PathWaypoint): SerializedPathWaypoint {
		return { WaypointAction: SerializeEnumItem(value.Action), WaypointPosition: SerializeVector3(value.Position) };
	}

	export interface SerializedColorSequenceKeypoint {
		readonly ColorTime: number;
		readonly ColorValue: SerializedColor3;
	}
	export function SerializeColorSequenceKeypoint(value: ColorSequenceKeypoint): SerializedColorSequenceKeypoint {
		return { ColorTime: value.Time, ColorValue: SerializeColor3(value.Value) };
	}

	export function SerializeColorSequence(value: ColorSequence) {
		return { ColorKeypoints: value.Keypoints.map((v) => SerializeColorSequenceKeypoint(v)) };
	}

	export interface SerializedNumberSequenceKeypoint {
		readonly NumberTime: number;
		readonly NumberValue: number;
	}
	export function SerializeNumberSequenceKeypoint(value: NumberSequenceKeypoint): SerializedNumberSequenceKeypoint {
		return { NumberTime: value.Time, NumberValue: value.Value };
	}

	export function SerializeNumberSequence(value: NumberSequence) {
		return { NumberKeypoints: value.Keypoints.map((v) => SerializeNumberSequenceKeypoint(v)) };
	}

	export function Serialize(value: unknown, destructureMode = DestructureMode.Default) {
		if (destructureMode === DestructureMode.ToString) {
			return tostring(value);
		}

		if (typeIs(value, "Instance")) {
			return value.GetFullName();
		} else if (typeIs(value, "vector") || typeIs(value, "Vector3int16")) {
			return SerializeVector3(value);
		} else if (typeIs(value, "Vector2") || typeIs(value, "Vector2int16")) {
			return SerializeVector2(value);
		} else if (typeIs(value, "DateTime")) {
			return SerializeDateTime(value);
		} else if (typeIs(value, "EnumItem")) {
			return SerializeEnumItem(value);
		} else if (typeIs(value, "NumberRange")) {
			return SerializeNumberRange(value);
		} else if (typeIs(value, "UDim")) {
			return SerializeUDim(value);
		} else if (typeIs(value, "UDim2")) {
			return SerializeUDim2(value);
		} else if (typeIs(value, "Color3")) {
			return SerializeColor3(value);
		} else if (typeIs(value, "BrickColor")) {
			return SerializeBrickColor(value);
		} else if (typeIs(value, "Rect")) {
			return SerializeRect(value);
		} else if (typeIs(value, "PathWaypoint")) {
			return SerializePathWaypoint(value);
		} else if (typeIs(value, "ColorSequenceKeypoint")) {
			return SerializeColorSequenceKeypoint(value);
		} else if (typeIs(value, "ColorSequence")) {
			return SerializeColorSequence(value);
		} else if (typeIs(value, "NumberSequenceKeypoint")) {
			return SerializeNumberSequenceKeypoint(value);
		} else if (typeIs(value, "NumberSequence")) {
			return SerializeNumberSequence(value);
		} else if (typeIs(value, "number") || typeIs(value, "string") || typeIs(value, "boolean")) {
			return value;
		} else if (typeIs(value, "table")) {
			return HttpService.JSONEncode(value);
		} else if (typeIs(value, "nil")) {
			return undefined;
		} else {
			throw `Destructuring of '${typeOf(value)}' not supported by Serializer`;
		}
	}
}
