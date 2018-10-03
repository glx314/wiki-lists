/** Base type abstraction */
import {arrayToMap, Map} from "../utils";


export interface Type<T> {
    tag: string;
}

export enum Types {
    BOOLEAN = "boolean",
    NUMBER = "number",
    TEXT = "text",
    STRUCT = "struct",
    ENUM = "enum",
    DATETIME = "datetime",
}
export class BooleanType implements Type<boolean> {
    tag = Types.BOOLEAN;
}

export class NumberType implements Type<number> {
    tag =  Types.NUMBER;
}

export class DatetimeType implements Type<Date> {
    tag =  Types.DATETIME;
}

export class TextType implements Type<string> {
    tag = Types.TEXT;
    rich:boolean = false;
    constructor(rich:boolean = false) {
        this.rich = rich;
    }
}

export interface EnumValue {
    value: string;
    label?: string,
    icon?: string,
    color?:string
    saved?:boolean;
}

export class EnumType implements Type<string> {
    tag = Types.ENUM;
    values : EnumValue[] = [];
}

export function newType(typeTag:string) {
    switch(typeTag) {
        case Types.TEXT :
            return new TextType();
        case Types.NUMBER :
            return new NumberType();
        case Types.BOOLEAN :
            return new BooleanType();
        case Types.DATETIME:
            return new DatetimeType();
        case Types.ENUM:
            let res = new EnumType();
            // Two empty values for the UI
            // Fixme : should be on UI side, not here
            res.values.push({value:null});
            res.values.push({value:null});
            return res;
        default:
            throw new Error(`Type not supported : ${typeTag}`);
    }
}

export class Attribute {
    name: string;
    label?: string;
    type: Type<any>;
    isName?: boolean = false;
    isMandatory?: boolean = false;
    saved ?:boolean = false;
    system ?:boolean = false;
    hidden ?:boolean = false;


}


export class StructType implements Type<Map<any>> {
    tag: Types.STRUCT;
    attributes : Attribute[] = [];
    constructor(attributes:Attribute[] = []) {
        this.attributes = attributes;
    }
}

export function attributesMap(schema:StructType) : Map<Attribute> {
    return arrayToMap(schema.attributes, attr => attr.name);
}

export function enumValuesMap(type:EnumType) : Map<EnumValue> {
    return arrayToMap(type.values, enumVal => enumVal.value);
}


