/**
 * Interfaces para representar o google.protobuf.Struct de forma tipada
 */
export interface ProtobufValue {
	kind?: 'stringValue' | 'numberValue' | 'boolValue' | 'structValue' | 'listValue' | 'nullValue';
	stringValue?: string;
	numberValue?: number;
	boolValue?: boolean;
	structValue?: ProtobufStruct;
	listValue?: { values: ProtobufValue[] };
	nullValue?: 0;
}

export interface ProtobufStruct {
	fields: Record<string, ProtobufValue>;
}