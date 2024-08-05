import DataSource from "./data.js";
import Expression, { Value } from "./expression.js";

export default function evaluate(input: string, parameters: DataSource): Value {
    return new Expression(input)
        .evaluate(parameters);
}

export { default as Expression, Value } from './expression.js';
export { default as DataSource } from './data.js';
export { default as Operator } from './tokens/operators/operator.js';
export { default as Null } from './tokens/null.js';

export { default as RandomDataSource } from './source.js'

export * as lib from './lib.js';