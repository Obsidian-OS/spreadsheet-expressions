import {Token, TokenMatcher, Value} from "../expression.js";
import Numeric from "./numeric.js";

export default abstract class Operator implements Token {
    abstract token: string;
    abstract offset: number;

    abstract precedence: number;
    abstract associativity: 'left' | 'right';

    abstract operands: number;

    abstract apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
}

export class AdditionOperator extends Operator {
    token: string = "+";
    precedence: number = 10;
    associativity: 'left' | 'right' = "left";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.add(i));

        throw {
            type: "TypeError: Operator `add` is not applicable to its operands",
            operands,
        };
    }
}
export class SubtractionOperator extends Operator {
    token: string = "-";
    precedence: number = 10;
    associativity: 'left' | 'right' = "left";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.sub(i));

        throw {
            type: "TypeError: Operator `sub` is not applicable to its operands",
            operands,
        };
    }
}
export class MultiplicationOperator extends Operator {
    token: string = "*";
    precedence: number = 15;
    associativity: 'left' | 'right' = "left";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.mul(i));

        throw {
            type: "TypeError: Operator `mul` is not applicable to its operands",
            operands,
        };
    }
}
export class DivisionOperator extends Operator {
    token: string = "/";
    precedence: number = 15;
    associativity: 'left' | 'right' = "left";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.div(i));

        throw {
            type: "TypeError: Operator `div` is not applicable to its operands",
            operands,
        };
    }
}
export class ExponentOperator extends Operator {
    token: string = "**";
    precedence: number = 20;
    associativity: 'left' | 'right' = "right";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.power(i));

        throw {
            type: "TypeError: Operator `pow` is not applicable to its operands",
            operands,
        };
    }
}
export class LShiftOperator extends Operator {
    token: string = "<<";
    precedence: number = 5;
    associativity: 'left' | 'right' = "right";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.lshift(i));

        throw {
            type: "TypeError: Operator `lshift` is not applicable to its operands",
            operands,
        };
    }
}
export class RShiftOperator extends Operator {
    token: string = ">>";
    precedence: number = 5;
    associativity: 'left' | 'right' = "right";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.rshift(i));

        throw {
            type: "TypeError: Operator `rshift` is not applicable to its operands",
            operands,
        };
    }
}
export class BitwiseAndOperator extends Operator {
    token: string = "&";
    precedence: number = 1;
    associativity: 'left' | 'right' = "right";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.band(i));

        throw {
            type: "TypeError: Operator `band` is not applicable to its operands",
            operands,
        };
    }
}
export class BitwiseOrOperator extends Operator {
    token: string = "|";
    precedence: number = 1;
    associativity: 'left' | 'right' = "right";
    operands: number = 2;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce((a, i) => a.bor(i));

        throw {
            type: "TypeError: Operator `bor` is not applicable to its operands",
            operands,
        };
    }
}
export class BitwiseNotOperator extends Operator {
    token: string = "~";
    precedence: number = 1;
    associativity: 'left' | 'right' = "right";
    operands: number = 1;

    constructor(readonly offset: number) {
        super();
    }

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
    apply(operands: Numeric[]): Numeric {
        if (operands.every(i => i instanceof Numeric))
            return (operands as Numeric[]).reduce(a => a.bnot());

        throw {
            type: "TypeError: Operator `bnot` is not applicable to its operands",
            operands,
        };
    }
}

export function parseOperator(op: string, offset: number): Operator | null {
    const operators = {
        "+": (offset: number) => new AdditionOperator(offset),
        "-": (offset: number) => new SubtractionOperator(offset),
        "*": (offset: number) => new MultiplicationOperator(offset),
        "/": (offset: number) => new DivisionOperator(offset),
        "**": (offset: number) => new ExponentOperator(offset),
        "<<": (offset: number) => new LShiftOperator(offset),
        ">>": (offset: number) => new RShiftOperator(offset),
        "|": (offset: number) => new BitwiseOrOperator(offset),
        "&": (offset: number) => new BitwiseAndOperator(offset),
        "~": (offset: number) => new BitwiseNotOperator(offset),
    };

    if (op in operators)
        return operators[op as keyof typeof operators](offset);

    return null;
}

export const operators: TokenMatcher<Operator>[] = [
    stream => parseOperator(stream.peek().split(/\s+/)[0].trim(), stream.offset)
];