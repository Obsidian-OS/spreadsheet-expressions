import { StringStream, Token, TokenMatcher, Value } from "../expression.js";
import Literal from "./literal.js";

export default class Null implements Value {
    constructor(readonly token: Token) {
        
    }

    static anonymous(): Value {
        return new Null({
            token: 'null',
            offset: 0
        });
    }
}

export class NullToken extends Literal {
    token: string = "null";

    constructor(readonly offset: number) {
        super();
    }

    intoValue(): Value {
        return new Null({
            token: this.token,
            offset: this.offset
        });
    }
}

export const matcher: TokenMatcher<NullToken> = function (stream: StringStream): NullToken | null {
    return stream.match(/^\s*null/, (tok, offset) => new NullToken(offset));
}