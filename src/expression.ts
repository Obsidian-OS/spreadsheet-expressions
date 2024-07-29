import DataSource from "./data.js";
import Null, { matcher as NullTokenMatcher } from './tokens/null.js';
import { matcher as NumericTokenMatcher } from './tokens/numeric.js';
import { operators } from "./tokens/operator.js";

export default class Expression {
    private readonly postfix_expression: Token[];

    constructor(readonly expression: string) {
        this.postfix_expression = this.postfix(this.tokenise(expression));
    }

    evaluate(datasource: DataSource): Value {
        return Null.anonymous();
    }

    private postfix(expression: Token[]): Token[] {
        return expression;
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
        ...operators
    ];
}

export class StringStream {
    offset: number = 0;
    prevOffset: number = 0;
    constructor(private readonly source: string) {}

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