import test from 'node:test';
import * as expr from '#expr';

test("Parse Expression", function() {
    return new expr.Expression("1 + 2 * 3");
});

test("Parse Expression with names", function() {
    return new expr.Expression("1 + 2 * n");
});

test("Parse Expression with parentheses", function() {
    return new expr.Expression("(1 + 2) * n");
});

test("Parse Expression with functions", function() {
    return new expr.Expression("tan(1 + 2) * n");
});

test("Parse Expression with multiple arguments", function() {
    return new expr.Expression("x(1, 2) * n");
});

test("Parse String", function() {
    console.log(new expr.Expression(`'hello world'`));
});

test("Parse String with escapes", function() {
    console.log(new expr.Expression(`"hello world\\n"`));
});

test("Parse String with an escaped quote", function() {
    console.log(new expr.Expression(`"hello world\\""`));
})