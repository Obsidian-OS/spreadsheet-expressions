import {StringStream, Token} from "../expression.js";

export class CommaToken implements Token {
    readonly token: string = ",";

    constructor(readonly offset: number) {}
}

export function matcher(stream: StringStream): CommaToken | null {
    return stream.match(/^,/, (tok, offset) => new CommaToken(offset));
}