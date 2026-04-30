// src/components/CopyMcpServerButton/index.tsx
import React, {useState} from 'react';
import styles from './styles.module.css';

const PLACEHOLDER_CONFIG = `# Vantage Docs MCP server — coming soon\n# This will produce a config snippet you can paste into Claude Desktop, Cursor, etc.\n`;

export default function CopyMcpServerButton(): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PLACEHOLDER_CONFIG);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable in some contexts; ignore
    }
  };

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={handleCopy}
      aria-label="Copy Vantage Docs MCP server config">
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className={styles.icon}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span>{copied ? 'Copied (preview)' : 'Copy MCP Server'}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.chev}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
