import { StringStream, Token, TokenMatcher, Value } from "../expression.js";
import Literal from "./literal.js";

export default class Null implements Value {
    constructor() {
        
    }

    static fromToken(token: NullToken): Value {
        return new Null();
    }
}

export class NullToken extends Literal {
    token: string = "null";

    constructor(readonly offset: number) {
        super();
    }

    intoValue(): Value {
        return Null.fromToken(new NullToken(0));
    }
}

export function matcher(stream: StringStream): NullToken | null {
    return stream.match(/^\s*null/, (tok, offset) => new NullToken(offset));
}