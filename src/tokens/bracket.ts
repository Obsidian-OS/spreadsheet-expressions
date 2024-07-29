import {StringStream, Token} from "../expression.js";

export class Bracket implements Token {
    constructor(readonly token: string, readonly offset: number) {
    }

    isLeftParenthesis() {
        return this.token == "(";
    }

    isRightParenthesis() {
        return this.token == ")";
    }
}

export function matcher(stream: StringStream): Bracket | null {
    return stream.match(/^[()]/, (tok, offset) => new Bracket(tok, offset));
}