import { describe, expect, it } from 'vitest';
import { runCommand } from './commands';

describe('runCommand', () => {
    it('echoes its arguments', () => {
        expect(runCommand('echo hello   world')).toEqual(['hello world']);
    });

    it('lists every command in help', () => {
        const output = runCommand('help').join('\n');
        expect(output).toContain('help');
        expect(output).toContain('echo');
        expect(output).toContain('clear');
    });

    it('asks to clear the screen', () => {
        expect(runCommand('clear')).toEqual({ clear: true });
    });

    it('prints nothing for blank input', () => {
        expect(runCommand('   ')).toEqual([]);
    });

    it('reports unknown commands', () => {
        expect(runCommand('nope')[0]).toMatch(/nope: command not found/);
    });
});
