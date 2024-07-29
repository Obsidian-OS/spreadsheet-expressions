import { StringStream, Token, TokenMatcher, Value } from "../expression.js";
import Literal from "./literal.js";

export default class Numeric implements Value {
    /// Arbitrary Precision
    private data: Uint8Array;

    constructor(readonly token: NumericToken) {
        this.data = new Uint8Array();
    }

    // add(numeric: Numeric): Numeric {
    //
    // }
    //
    // sub(numeric: Numeric): Numeric {
    //
    // }
    //
    // mul(numeric: Numeric): Numeric {
    //
    // }
    //
    // div(numeric: Numeric): Numeric {
    //
    // }
    //
    // power(numeric: Numeric): Numeric {
    //
    // }
    //
    // lshift(numeric: Numeric): Numeric {
    //
    // }
    //
    // rshift(numeric: Numeric): Numeric {
    //
    // }
}

export type NumericType = 'integer' | 'float' | 'scientific' | 'hex' | 'oct' | 'bin';

export class NumericToken extends Literal {
    readonly token: string;
    
    constructor(private type: NumericType, private readonly raw: RegExpMatchArray, readonly offset: number) {
        super();
        this.token = raw[0];
    }

    intoValue(): Value {
        return new Numeric(this);
    }
}

export function matcher(stream: StringStream): NumericToken | null {
    const isValid = (x: any): x is readonly [NumericType, RegExpMatchArray] => !!x[1];
    const format = Object.entries({
        integer: /^[\d_]+/,
        float: /^[\d_]+\.[\d_]+/,
        scientific: /^[\d_]+(\.[\d+]+)?([eE]-?\d+(\.[\d+_])?)?/,
        hex: /^0x[a-fA-F0-9_]+/,
        oct: /^0o[0-8_]+/,
        bin: /^0b[0-1_]+/,
    }).map(([key, regex]) => [key, regex.exec(stream.peek())] as [NumericType, RegExpMatchArray])
        .filter(isValid)[0];

    if (!format)
        return null;

    return new NumericToken(format[0], format[1], stream.offset);
}