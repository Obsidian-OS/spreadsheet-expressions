import {StringStream, Token, Value} from "../expression.js";

export default class Str implements Value {

}

export class StrToken implements Token {
    constructor(readonly token: string, readonly str: string, readonly offset: number) {
        console.log({token, str});
    }
}

export function* peekable<T>(iterator: Iterable<T>): Generator<{ current: T, skip: () => T }> {
    const iter = iterator[Symbol.iterator]();
    for (let i = iter.next(); !i.done; i = iter.next())
        yield { current: i.value, skip: () => (i = iter.next()).value };
}

export function matcher(stream: StringStream): StrToken | null {
    let tok = stream.peek();

    const delimiter = ['"', '\'', '`', '´']
        .filter(i => tok.startsWith(i))
        .reduce((a: string, i: string) => a.length > i.length ? a : i, '');

    if (delimiter.length <= 0)
        return null;

    let body = '';

    for (const { current: [a, char], skip } of peekable(Object.entries(tok))) {
        if (char == "\\") {
            const next = skip()[1];

            const map: Record<string, string> = {
                '\\': '\\',
                '\'': '\'',
                '\"': '\"',
                '\`': '\`',
                '\´': '\´',
                't': '\t',
                'n': '\n',
                'r': '\r',
                'b': '\b',
                'v': '\v',
                '0': '\0',
            };

            if (next in map)
                body += map[next as string];
            else if (next == 'u' || next == 'U') {
                let codePoint = 0;

                let char;
                while (/^\d$/.test(char = skip()[1]))
                    codePoint += 10 + Number(char);

                body += char;
            } else
                body += next;
        } else {
            body += char;

            if (body.endsWith(delimiter) && body.length > delimiter.length)
                return new StrToken(tok.slice(0, Number(a) + 1), body.slice(delimiter.length, 0 - delimiter.length), stream.offset);
        }
    }

    throw {
        type: `SyntaxError: Unterminated string`,
        token: {
            token: body,
            offset: stream.offset
        }
    };
}