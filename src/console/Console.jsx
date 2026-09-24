import { useEffect, useRef, useState } from 'react';
import { runCommand } from './commands';

const PROMPT = '> ';
const WELCOME = ['Welcome to NameName 14.10 ( ).', 'Type "help" for a list of commands.'];

export default function Console() {
    const [lines, setLines] = useState(WELCOME);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    // Index into history while browsing with the arrow keys; history.length means "not browsing".
    const [historyIndex, setHistoryIndex] = useState(0);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
    }, [lines]);

    function submit() {
        const result = runCommand(input);
        if (result.open) {
            window.location.assign(result.open);
            return;
        }
        if (result.clear) {
            setLines([]);
        } else {
            setLines([...lines, PROMPT + input, ...result]);
        }
        const nextHistory = input.trim() ? [...history, input] : history;
        setHistory(nextHistory);
        setHistoryIndex(nextHistory.length);
        setInput('');
    }

    function browseHistory(step) {
        const index = Math.min(Math.max(historyIndex + step, 0), history.length);
        setHistoryIndex(index);
        setInput(history[index] ?? '');
    }

    function onKeyDown(event) {
        if (event.key === 'Enter') {
            submit();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            browseHistory(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            browseHistory(1);
        }
    }

    return (
        <div className="console" onClick={() => inputRef.current?.focus()}>
            {lines.map((line, i) => (
                <div className="line" key={i}>{line}</div>
            ))}
            <div className="line input-line" ref={bottomRef}>
                <span>{PROMPT}</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Console input"
                />
            </div>
        </div>
    );
}
