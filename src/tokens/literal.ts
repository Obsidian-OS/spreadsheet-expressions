import { Token, Value } from "../expression.js";

export default abstract class Literal implements Token {
    abstract token: string;
    abstract offset: number;

    abstract intoValue(): Value;
}