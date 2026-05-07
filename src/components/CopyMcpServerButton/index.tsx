// src/components/CopyMcpServerButton/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

const MCP_URL = 'https://MPYYYNENH9.algolia.net/mcp/1/QXU8XeCfR5uhnvuIuuHhLQ/mcp';

const MCP_CONFIG = JSON.stringify(
  { mcpServers: { 'vantage-docs': { url: MCP_URL } } },
  null,
  2
);

const MCP_INSTALL_CMD = `claude mcp add --transport http vantage-docs ${MCP_URL}`;

function getMarkdownUrl(pathname: string): string {
  if (pathname.startsWith('/reference/api')) return '/llms-vantage-api.txt';
  if (pathname.startsWith('/reference/cli')) return '/llms-vantage-cli.txt';
  if (pathname.startsWith('/reference/sdk')) return '/llms-vantage-sdk.txt';
  if (pathname.startsWith('/platform')) return '/llms-vantage-platform.txt';
  return '/llms-full.txt';
}

async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
}

function ItemLabel({ label, desc }: { label: string; desc: string }) {
  return (
    <span className={styles.itemText}>
      <span className={styles.itemLabel}>{label}</span>
      <span className={styles.itemDesc}>{desc}</span>
    </span>
  );
}

export default function CopyMcpServerButton(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { toggleChat } = useChatContext();
  const location = useLocation();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const markCopied = (key: string) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mcpConfigB64 = typeof btoa !== 'undefined' ? btoa(JSON.stringify({ url: MCP_URL })) : '';
  const cursorHref = `cursor://anysphere.cursor-deeplink/mcp/install?name=vantage-docs&config=${mcpConfigB64}`;
  const vsCodeHref = `vscode://GitHub.copilot/mcp?config=${mcpConfigB64}`;
  const markdownHref = getMarkdownUrl(location.pathname);

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Page tools">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.icon}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span>Copy MCP Server</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${styles.chev} ${open ? styles.chevOpen : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          {/* MCP group */}
          <button role="menuitem" className={styles.item} onClick={async () => { await copyText(MCP_CONFIG); markCopied('config'); setOpen(false); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <ItemLabel
              label={copiedKey === 'config' ? 'Copied!' : 'Copy MCP Server'}
              desc="JSON config for Claude Desktop"
            />
          </button>

          <a role="menuitem" className={styles.item} href={cursorHref} onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
            <ItemLabel label="Connect to Cursor" desc="Add this MCP server to Cursor" />
          </a>

          <a role="menuitem" className={styles.item} href={vsCodeHref} onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
            <ItemLabel label="Connect to VS Code" desc="Add this MCP server to VS Code" />
          </a>

          <button role="menuitem" className={styles.item} onClick={async () => { await copyText(MCP_INSTALL_CMD); markCopied('install'); setOpen(false); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <ItemLabel
              label={copiedKey === 'install' ? 'Copied!' : 'Copy MCP install command'}
              desc="claude mcp add CLI command"
            />
          </button>

          <div className={styles.divider} />

          {/* Page utilities */}
          <button role="menuitem" className={styles.item} onClick={() => { toggleChat(); setOpen(false); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <path d="M12 3l1.9 5.7L19.6 10l-5.7 1.3L12 17l-1.9-5.7L4.4 10l5.7-1.3z" />
            </svg>
            <ItemLabel label="Ask AI assistant" desc="Chat with the docs AI" />
          </button>

          <button role="menuitem" className={styles.item} onClick={async () => { await copyText(window.location.href); markCopied('page'); setOpen(false); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <ItemLabel
              label={copiedKey === 'page' ? 'Copied!' : 'Copy page'}
              desc="Copy current page URL"
            />
          </button>

          <a role="menuitem" className={styles.item} href={markdownHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.itemIcon}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
            <ItemLabel label="View as Markdown" desc="LLM-friendly text version" />
          </a>
        </div>
      )}
    </div>
  );
}
