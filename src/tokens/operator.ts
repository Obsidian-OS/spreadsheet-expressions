import { Token, TokenMatcher } from "../expression.js";

export default abstract class Operator implements Token {
    abstract token: string;
    abstract offset: number;

    abstract precedence: number;
    abstract associativity: 'left' | 'right';
}

export class AdditionOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "+";
        this.precedence = 10;
        this.associativity = "left"
    }
}
export class SubtractionOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "-";
        this.precedence = 10;
        this.associativity = "left"
    }
}
export class MultiplicationOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "*";
        this.precedence = 15;
        this.associativity = "left"
    }
}
export class DivisionOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "/";
        this.precedence = 15;
        this.associativity = "left"
    }
}
export class ExponentOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "**";
        this.precedence = 20;
        this.associativity = "right"
    }
}
export class LShiftOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "<<";
        this.precedence = 5;
        this.associativity = "right"
    }
}
export class RShiftOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = ">>";
        this.precedence = 5;
        this.associativity = "right"
    }
}
export class BitwiseOrOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "|";
        this.precedence = 1;
        this.associativity = "right"
    }
}
export class BitwiseAndOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "&";
        this.precedence = 1;
        this.associativity = "right"
    }
}
export class BitwiseNotOperator extends Operator {
    token: string;
    precedence: number;
    associativity: 'left' | 'right';

    constructor(readonly offset: number) {
        super();
        this.token = "~";
        this.precedence = 1;
        this.associativity = "right"
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