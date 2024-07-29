import {Value} from "#expr";
import Numeric from "../numeric.js";

export default function apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
export default function apply(operands: Numeric[]): Numeric {
    if (operands.every(i => i instanceof Numeric))
        return (operands as Numeric[]).reduce((a, i) => a.power(i));

    throw {
        type: "TypeError: Operator `pow` is not applicable to its operands",
        operands,
    };
}