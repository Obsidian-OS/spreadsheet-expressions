import {StringStream, Token} from "../expression.js";

export class NameToken implements Token {
    constructor(readonly token: string, readonly offset: number) {
    }

}

export function matcher(stream: StringStream): NameToken | null {
    return stream.match<NameToken>(/^(:?[^\x00-\x7F]|[A-Za-z$_])(:?[^\x00-\x7F]|[A-Za-z0-9$_])*/, (name, offset) => new NameToken(name, offset));
}