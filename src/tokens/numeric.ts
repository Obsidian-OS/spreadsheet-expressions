import { StringStream, Token, TokenMatcher, Value } from "../expression.js";
import Literal from "./literal.js";

export default class Numeric implements Value {
    // TODO: Implement arbitrary precision
    data: number = 0;

    constructor() {
        this.data = 0;
    }

    static fromToken(token: NumericToken): Numeric {
        return ({
            'integer': () => Numeric.fromData(Number(token.raw[0])),
            'float': () => Numeric.fromData(Number(token.raw[0])),
            'scientific': () => { throw new Error("TODO: Implement this") },
            'hex': () => { throw new Error("TODO: Implement this") },
            'oct': () => { throw new Error("TODO: Implement this") },
            'bin': () => { throw new Error("TODO: Implement this") }
        } as Record<NumericType, () => Numeric>)[token.type]()
    }

    static fromData(data: number): Numeric  {
        const n = new Numeric();
        n.data = data;
        return n;
    }

    static anonymous(): Numeric {
        return new Numeric();
    }

    add(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data + numeric.data);
    }

    sub(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data - numeric.data);
    }

    mul(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data * numeric.data);
    }

    div(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data / numeric.data);
    }

    power(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data ** numeric.data);
    }

    lshift(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data << numeric.data);
    }

    rshift(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data >> numeric.data);
    }

    band(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data & numeric.data);
    }

    bor(numeric: Numeric): Numeric {
        return Numeric.fromData(this.data | numeric.data);
    }

    bnot(): Numeric {
        return Numeric.fromData(~this.data);
    }
}

export type NumericType = 'integer' | 'float' | 'scientific' | 'hex' | 'oct' | 'bin';

export class NumericToken extends Literal {
    readonly token: string;
    
    constructor(readonly type: NumericType, readonly raw: RegExpMatchArray, readonly offset: number) {
        super();
        this.token = raw[0];
    }

    intoValue(): Value {
        return Numeric.fromToken(this);
    }
}

export function matcher(stream: StringStream): NumericToken | null {
    const isValid = (x: any): x is readonly [NumericType, RegExpMatchArray] => !!x[1];
    const format = Object.entries({
        integer: /^-?[\d_]+/,
        float: /^-?[\d_]+\.[\d_]+/,
        scientific: /^-?[\d_]+(\.[\d+]+)?([eE]-?\d+(\.[\d+_])?)?/,
        hex: /^-?0x[a-fA-F0-9_]+/,
        oct: /^-?0o[0-8_]+/,
        bin: /^-?0b[0-1_]+/,
    }).map(([key, regex]) => [key, regex.exec(stream.peek())] as [NumericType, RegExpMatchArray])
        .filter(isValid)[0];

    if (!format)
        return null;

    return new NumericToken(format[0], format[1], stream.offset);
}