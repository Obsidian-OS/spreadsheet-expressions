import {Value} from "#expr";
import Numeric from "../numeric.js";

export default function apply<Operands extends Value[], Return extends Value>(operands: Operands): Return;
export default function apply(operands: Numeric[]): Numeric {
    if (operands.every(i => i instanceof Numeric))
        return (operands as Numeric[]).reduce((a, i) => a.bor(i));

    throw {
        type: "TypeError: Operator `bor` is not applicable to its operands",
        operands,
    };
}