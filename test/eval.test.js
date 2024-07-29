import test from 'node:test';
import * as expr from '#expr';

test("Evaluate basic expression", function() {
    const value = new expr.Expression("1 + 2")
        .evaluate(new expr.RandomDataSource());

    console.log(value);
});

test("Evaluate slightly more complex expression", function() {
    const value = new expr.Expression("1 + 2 * 3")
        .evaluate(new expr.RandomDataSource());

    console.log(value);
});

test("Evaluate expression with variables", function() {
    const value = new expr.Expression("1 + 2 * n")
        .evaluate(new expr.RandomDataSource());

    console.log(value);
});