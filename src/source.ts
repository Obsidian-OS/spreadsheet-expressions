import DataSource, { Address } from "./data.js";
import { Value } from "./expression.js";
import {Null} from "./main.js";
import data from "./functions.js";

export default class RandomDataSource extends DataSource {

    store: Record<string, Value> = data;

    public getNamedValue(name: string): Value {
        return this.store[name] ?? new Null();
    }

    public get(address: Address): Value {
        return new Null()
    }
}