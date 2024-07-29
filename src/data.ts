import { Value } from "./expression.js"

export default abstract class DataSource {
    public abstract get(address: Address): Value;
    public abstract getNamedValue(name: string): Value
}

export type Address = {
    file?: string,
    row: Offset,
    col: Offset,
};

export type Offset = {
    relative: boolean,
    offset: bigint
};