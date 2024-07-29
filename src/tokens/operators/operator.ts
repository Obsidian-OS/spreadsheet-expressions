import {Token, TokenMatcher, Value} from "../../expression.js";

import add from './add.js';
import band from "./band.js";
import bnot from "./bnot.js";
import bor from "./bor.js";
import div from "./div.js";
import lshift from "./lshift.js";
import mul from "./mul.js";
import pow from "./pow.js";
import rshift from "./rshift.js";
import sub from "./sub.js";

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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return add(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return sub(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return mul(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return div(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return pow(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return lshift(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return rshift(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return band(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return bor(operands);
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

    apply<Operands extends Value[], Return extends Value>(operands: Operands): Return {
        return bnot(operands);
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