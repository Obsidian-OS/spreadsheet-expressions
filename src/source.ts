import DataSource, { Address } from "./data.js";
import { Value } from "./expression.js";
import {Null} from "./main.js";

export default class RandomDataSource extends DataSource {
    public get(address: Address): Value {
        return Null.anonymous()
    }
}