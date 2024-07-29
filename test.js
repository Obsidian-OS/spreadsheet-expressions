import util from 'node:util';
import * as fs from 'node:fs/promises';
import chalk from 'chalk';

const argv = process.argv.slice(2);

const getArg = arg => argv.includes(arg) ? argv.splice(argv.indexOf(arg), 2)[1] : null;
const toggle = arg => argv.includes(arg) ? !(void argv.splice(argv.indexOf(arg), 1)) : false;

const logLevel = getArg("--log-level") ?? "debug";
const exitOnFailure = !toggle("--continue-on-failure");
const printReturn = !toggle("--no-return");

export const stripAnsi = str => str.replace(/[\u001b\u009b][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[\dA-ORZcf-nqry=><]/g, '');
export const centre = (text, width) => {
    const colourless = stripAnsi(text);
    const pad = Math.floor((width - colourless.length) / 2);
    return `${' '.repeat(pad)}${text}${' '.repeat(pad)}`.padStart(width, ' ');
}
export function stdout(tag, ...msg) {
    const log = msg
        .map(i => ['string', 'number', 'bigint', 'boolean'].includes(typeof i) ? i : util.inspect(i, false, null, true))
        .join(' ')
        .split('\n')
        .map((i, a) => `${a ? centre('\u2502', stripAnsi(tag).length) : tag} ${i}\n`);

    for (const i of log)
        process.stdout.write(i);
}

export function stderr(tag, ...msg) {
    const log = msg
        .map(i => ['string', 'number', 'bigint', 'boolean'].includes(typeof i) ? i : util.inspect(i, false, null, true))
        .join(' ')
        .split('\n')
        .map((i, a) => `${a ? centre('\u2502', stripAnsi(tag).length) : tag} ${i}\n`);

    for (const i of log)
        process.stderr.write(i);
}

export const log = {
    err: (...arg) => void (['err', 'info', 'output', 'debug'].includes(logLevel) && stderr(chalk.grey(`[${chalk.red('Error')}]`), ...arg)),
    info: (...arg) => void (['info', 'output', 'debug'].includes(logLevel) && stdout(chalk.grey(`[${chalk.blue('Info')}]`), ...arg)),
    output: (...arg) => void (['output', 'debug'].includes(logLevel) && stdout(chalk.grey(`[${chalk.yellow('Output')}]`), ...arg)),
    debug: (...arg) => void (['debug'].includes(logLevel) && stdout(chalk.grey(`[${chalk.cyan('Debug')}]`), ...arg))
}

log.debug("Running tests:", argv);

for (const path of argv) {
    try {
        const file = await import(await fs.realpath(path));

        for (const [name, fn] of Object.entries(file))
            try {
                const result = fn();
                if (printReturn)
                    log.output(chalk.green("Success"), chalk.grey(`${path}::${name}`), result);
                else
                    log.info(chalk.green("Success"), chalk.grey(`${path}::${name}`));
            } catch (err) {
                log.err(chalk.yellow("Failure"), chalk.grey(`${path}::${name}`), err);
                if (exitOnFailure)
                    process.exit(-1);
            }
    } catch (err) {
        log.err(chalk.red("Error"), path, err);
        if (exitOnFailure)
            process.exit(-1);
    }
}

log.info(chalk.green("All tests passed"));