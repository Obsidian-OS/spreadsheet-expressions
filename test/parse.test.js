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