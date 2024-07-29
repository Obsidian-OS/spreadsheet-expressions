import DataSource from "./data.js";
import Null, {matcher as NullTokenMatcher} from './tokens/null.js';
import {matcher as NumericTokenMatcher} from './tokens/numeric.js';
import {matcher as NameTokenMatcher, NameToken} from './tokens/name.js';
import {Bracket, matcher as BracketTokenMatcher} from './tokens/bracket.js';
import {matcher as CommaTokenMatcher} from './tokens/comma.js';
import Operator, {operators} from "./tokens/operator.js";
import Literal from "./tokens/literal.js";
import {CommaToken} from "./tokens/comma.js";

export default class Expression {
    private readonly postfix_expression: Token[];

    constructor(readonly expression: string) {
        this.postfix_expression = this.postfix(this.tokenise(expression));
    }

    evaluate(datasource: DataSource): Value {
        return Null.anonymous();
    }

    private postfix(expression: Token[]): Token[] {
        const output: Token[] = [];
        const opstack: Token[] = [];

        for (const token of expression)
            if (token instanceof Literal)
                output.push(token);

            else if (token instanceof NameToken)
                opstack.push(token);

            else if (token instanceof Operator) {
                for (const op of opstack.toReversed()) {
                    if (!(op instanceof Operator))
                        break;

                    if (op.precedence > token.precedence || (token.associativity == 'left' && token.precedence == op.precedence)) {
                        output.push(op);
                        opstack.pop();
                    }
                }

                opstack.push(token);
            } else if (token instanceof CommaToken)
                for (const op of opstack.toReversed())
                    if (op instanceof Bracket && op.isLeftParenthesis())
                        break;
                    else
                        output.push(op);
            else if (token instanceof Bracket && token.isLeftParenthesis())
                opstack.push(token);

            else if (token instanceof Bracket && token.isRightParenthesis()) {
                for (const op of opstack.toReversed()) {
                    if (op instanceof Bracket && op.isLeftParenthesis())
                        break;

                    output.push(opstack.pop()!);
                }

                opstack.pop();

                if (opstack.at(-1)! instanceof NameToken)
                    output.push(opstack.pop()!);
            }

        const parenthesis = opstack.find(i => i instanceof Bracket);
        if (parenthesis)
            throw {
                type: "SyntaxError: Bracket Mismatch",
                token: parenthesis
            };

        output.push(...opstack.splice(0, opstack.length).reverse());

        return output;
    }

    private tokenise(expression: string): Token[] {
        const stream = new StringStream(expression);
        const tokens: Token[] = [];

        while (true) {
            stream.skipWhitespace();

            const matched = Expression.tokens
                .map(i => i(stream))
                .filter((x: Token | null): x is Token => !!x);

            if (matched.length == 1)
                tokens.push(matched[0]);

            else if (matched.length == 0)
                break;

            else
                console.log(matched);

            stream.advanceBy(matched[0].token.length);
        }

        return tokens;
    }

    static tokens: TokenMatcher<Token>[] = [
        NullTokenMatcher,
        NumericTokenMatcher,
        NameTokenMatcher,
        BracketTokenMatcher,
        ...operators,
        CommaTokenMatcher
    ];
}

export class StringStream {
    offset: number = 0;
    prevOffset: number = 0;

    constructor(private readonly source: string) {
    }

    public peek(): string {
        return this.source.slice(this.offset);
    }

    getNextToken(length: number): string {
        this.prevOffset = this.offset;
        return this.source.substring(this.offset, this.offset += length);
    }

    public match<T extends Token>(matcher: RegExp | ((str: string) => string | null), map: (token: string, offset: number) => T | null): T | null {
        const result = matcher instanceof RegExp ? this.peek().match(matcher)?.[0] ?? null : matcher(this.peek());

        if (!result)
            return null;

        return map(result, this.offset);
    }

    getMatchedLength(): number {
        return this.prevOffset;
    }

    /// Moves the cursor along by n characters, returning the lengthof the stream before
    advanceBy(length: number): number {
        this.prevOffset = this.offset;
        this.offset += length;
        return this.prevOffset;
    }

    skipWhitespace() {
        const whitespace = /^\s*/.exec(this.peek());

        if (whitespace)
            this.advanceBy(whitespace[0].length);
    }
}

export interface Value {
    token: Token
}

export interface Token {
    token: string,
    offset: number,
}

export type TokenMatcher<T extends Token> = (stream: StringStream) => T | null;