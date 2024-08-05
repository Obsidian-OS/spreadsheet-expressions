import test from 'node:test';
import * as expr from '#expr';

test("Check parsing strings", function() {
    const stream = new expr.lib.expression.StringStream(`'Hello World\\''`);
    const str = new expr.lib.str.matcher(stream);

    console.log(str);
});