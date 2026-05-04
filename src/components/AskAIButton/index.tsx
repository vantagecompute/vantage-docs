// src/components/AskAIButton/index.tsx
import React, {useState} from 'react';
import styles from './styles.module.css';

export default function AskAIButton(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrap} data-navbar-ask-ai>
      <button
        type="button"
        className={styles.btn}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog">
        <svg
          className={styles.spark}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2">
          <path d="M12 3l1.9 5.7L19.6 10l-5.7 1.3L12 17l-1.9-5.7L4.4 10l5.7-1.3z" />
        </svg>
        <span>Ask AI</span>
      </button>
      {open && (
        <div className={styles.popover} role="dialog">
          <div className={styles.popoverTitle}>Coming soon</div>
          <div className={styles.popoverBody}>
            The docs AI is being trained. Check back soon — or use the search box for now.
          </div>
        </div>
      )}
    </div>
  );
}
