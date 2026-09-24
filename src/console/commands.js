// Each command takes its arguments and returns the lines to print.
// A command may instead return { clear: true } to wipe the screen.
export const commands = {
    help: {
        description: 'List available commands',
        run: () => Object.entries(commands).map(
            ([name, { description }]) => `${name.padEnd(8)}${description}`
        ),
    },
    echo: {
        description: 'Print its arguments',
        run: (args) => [args.join(' ')],
    },
    clear: {
        description: 'Clear the screen',
        run: () => ({ clear: true }),
    },
};

export function runCommand(input) {
    const [name, ...args] = input.trim().split(/\s+/);
    if (!name) {
        return [];
    }
    const command = commands[name];
    if (!command) {
        return [`${name}: command not found. Type "help" for a list of commands.`];
    }
    return command.run(args);
}
