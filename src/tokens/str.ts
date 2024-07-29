import {StringStream, Token, Value} from "../expression.js";

export default class Str implements Value {

}

export class StrToken implements Token {
    constructor(readonly token: string, readonly offset: number) {

    }
}

export function* peekable<T>(iterator: Iterable<T>): Generator<{ current: T, skip: () => T }> {
    const iter = iterator[Symbol.iterator]();
    for (let i = iter.next(); !i.done; i = iter.next())
        yield { current: i.value, skip: () => (i = iter.next()).value };
}

export function matcher(stream: StringStream): StrToken | null {
    let tok = stream.peek();

    const delimiter = ['"', '\'', '`', '´', "'''", '"""']
        .filter(i => tok.startsWith(i))
        .reduce((a: string, i: string) => a.length > i.length ? a : i, '');

    if (delimiter.length <= 0)
        return null;

    let body = '';
    let count_since_escape = 0;

    for (const { current: char, skip } of peekable(tok)) {
        if (char == "\\") {
            count_since_escape = 0;
            const next = skip();

            const map = ({
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
            })[next];

            if (map)
                body += map;
            else if (next == 'u' || next == 'U') {
                let codePoint = 0;

                let char;
                while (/^\d$/.test(char = skip()))
                    codePoint += 10 + Number(char);

                body += char;
            } else
                body += next;
        } else {
            body += char;
            count_since_escape += 1;
        }

        console.log({ body, delimiter });
        if (body.endsWith(delimiter) && count_since_escape >= delimiter.length && body.length >= 2 * delimiter.length) {
            console.log("Terminating", { body, delimiter });
            return new StrToken(body, stream.offset);
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