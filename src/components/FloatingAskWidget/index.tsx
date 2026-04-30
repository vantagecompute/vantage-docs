// src/components/FloatingAskWidget/index.tsx
import React, {useState} from 'react';
import styles from './styles.module.css';

export default function FloatingAskWidget(): React.JSX.Element {
  const [hint, setHint] = useState(false);

  return (
    <div className={styles.wrap}>
      <form
        className={styles.bar}
        onSubmit={(e) => {
          e.preventDefault();
          setHint(true);
          setTimeout(() => setHint(false), 2400);
        }}>
        <input
          className={styles.input}
          type="text"
          placeholder="Ask a question..."
          aria-label="Ask the docs"
        />
        <kbd className={styles.kbd}>⌘I</kbd>
        <button type="submit" className={styles.send} aria-label="Submit question">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </svg>
        </button>
      </form>
      {hint && (
        <div className={styles.hint} role="status">Coming soon — the docs AI is being trained.</div>
      )}
    </div>
  );
}
