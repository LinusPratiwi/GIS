export interface BTSType {
    fields:  Field[];
    records: Array<Array<number | string>>;
}

export interface Field {
    type: Type;
    id:   string;
}

export enum Type {
    Int = "int",
    Numeric = "numeric",
    Text = "text",
}
