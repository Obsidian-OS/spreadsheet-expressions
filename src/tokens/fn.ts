import {Value} from "#expr";

export default abstract class Fn implements Value {
    public abstract call(args: Value[]): Value;
}