# Algolia AI Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder "Ask AI" components with a working AI chat interface powered by Algolia Agent Studio, using Vercel AI SDK with a shared React context and slide-out side panel.

**Architecture:** ChatProvider context wraps the app in Root.js, holding `isOpen` and `useChat` state. AskAIButton and FloatingAskWidget become thin context consumers that toggle the panel. ChatSidePanel renders the full chat UI as a fixed right-side panel with streaming support.

**Tech Stack:** React, Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`), CSS Modules, Docusaurus

---

## File Structure

```
src/
  context/
    ChatContext.tsx          — ChatProvider + context definition
  components/
    AskAIButton/
      index.tsx              — consume ChatContext, toggle only (simplify)
      styles.module.css      — add active state styles
    FloatingAskWidget/
      index.tsx              — consume ChatContext, toggle only (simplify)
      styles.module.css      — add active state, simplify layout
    ChatSidePanel/
      index.tsx              — full chat UI (messages, input, streaming)
      styles.module.css      — panel layout, slide animation, message styles
  theme/
    Root.js                  — wrap children with <ChatProvider>
```

---

### Task 1: Install AI SDK Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install packages**

Run:
```bash
cd /home/b/Development/work/vantage-docs-algolia && npm install ai @ai-sdk/react @ai-sdk/openai-compatible
```

Expected: Packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify installation**

Run:
```bash
grep -E '"ai"|"@ai-sdk/react"|"@ai-sdk/openai-compatible"' package.json
```

Expected: All three packages appear in dependencies.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add Vercel AI SDK dependencies for Algolia agent"
```

---

### Task 2: Create ChatContext (ChatProvider)

**Files:**
- Create: `src/context/ChatContext.tsx`

- [ ] **Step 1: Create the context file**

```tsx
// src/context/ChatContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const algoliaProvider = createOpenAICompatible({
  baseURL: 'https://mpyyynenh9.algolia.net/agent-studio/1/agents/3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df/completions?compatibilityMode=ai-sdk-5',
  headers: {
    'x-algolia-application-id': 'MPYYYNENH9',
    'x-algolia-api-key': 'b3cadb2f7da0194ead335c3488237443',
  },
});

interface ChatContextValue {
  isOpen: boolean;
  toggleChat: () => void;
  chat: ReturnType<typeof useChat>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat({
    model: algoliaProvider(''),
  });

  const toggleChat = useCallback(() => {
    setIsOpen((o) => !o);
  }, []);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, chat }}>
      {children}
    </ChatContext.Provider>
  );
}
```

- [ ] **Step 2: Verify file created**

Run:
```bash
cat /home/b/Development/work/vantage-docs-algolia/src/context/ChatContext.tsx | head -20
```

Expected: File exists with correct imports.

- [ ] **Step 3: Commit**

```bash
git add src/context/ChatContext.tsx
git commit -m "feat: add ChatProvider context for shared AI chat state"
```

---

### Task 3: Create ChatSidePanel Component

**Files:**
- Create: `src/components/ChatSidePanel/index.tsx`
- Create: `src/components/ChatSidePanel/styles.module.css`

- [ ] **Step 1: Create the CSS module**

```css
/* src/components/ChatSidePanel/styles.module.css */

.wrap {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  background: var(--ifm-background-surface-color, #ffffff);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.wrap.open {
  transform: translateX(0);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--ifm-color-emphasis-200, #e6e6e6);
  flex-shrink: 0;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ifm-font-color-base, #1a1a1a);
}

.closeBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--ifm-font-color-secondary, #666);
  display: flex;
  align-items: center;
  justify-content: center;
}

.closeBtn:hover {
  color: var(--ifm-font-color-base, #1a1a1a);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.emptyState {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--ifm-font-color-secondary, #666);
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

.message {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

.userMessage {
  align-self: flex-end;
  background: var(--ifm-color-primary, #3578e5);
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.assistantMessage {
  align-self: flex-start;
  background: var(--ifm-color-emphasis-100, #f0f0f0);
  color: var(--ifm-font-color-base, #1a1a1a);
  border-bottom-left-radius: 4px;
}

.errorBanner {
  padding: 10px 20px;
  background: var(--ifm-color-danger-lightest, #ffe6e6);
  color: var(--ifm-color-danger-dark, #cc0000);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.retryBtn {
  background: var(--ifm-color-danger-dark, #cc0000);
  color: #fff;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.inputArea {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid var(--ifm-color-emphasis-200, #e6e6e6);
  flex-shrink: 0;
}

.input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--ifm-color-emphasis-300, #ccc);
  border-radius: 8px;
  font-size: 14px;
  background: var(--ifm-background-color, #fff);
  color: var(--ifm-font-color-base, #1a1a1a);
}

.input:disabled {
  background: var(--ifm-color-emphasis-100, #f0f0f0);
}

.sendBtn {
  background: var(--ifm-color-primary, #3578e5);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sendBtn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loadingDots {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ifm-color-emphasis-400, #999);
  animation: blink 1.4s infinite both;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0% { opacity: 0.2; }
  20% { opacity: 1; }
  100% { opacity: 0.2; }
}
```

- [ ] **Step 2: Create the component**

```tsx
// src/components/ChatSidePanel/index.tsx
import React from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function ChatSidePanel(): React.JSX.Element {
  const { isOpen, toggleChat, chat } = useChatContext();
  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload } = chat;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className={`${styles.wrap} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Ask AI</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={toggleChat}
          aria-label="Close chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>Sorry, something went wrong. Please try again.</span>
          <button type="button" className={styles.retryBtn} onClick={() => reload()}>
            Retry
          </button>
        </div>
      )}

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            Ask a question about Vantage Compute...
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.message} ${m.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
              {m.content}
              {m.role === 'assistant' && m.content === '' && isLoading && (
                <div className={styles.loadingDots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className={styles.inputArea} onSubmit={onSubmit}>
        <input
          className={styles.input}
          value={input}
          placeholder="Ask a question..."
          onChange={handleInputChange}
          disabled={isLoading}
          aria-label="Ask the docs"
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={isLoading || !input.trim()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </svg>
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Verify files created**

Run:
```bash
ls -la /home/b/Development/work/vantage-docs-algolia/src/components/ChatSidePanel/
```

Expected: `index.tsx` and `styles.module.css` exist.

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatSidePanel/
git commit -m "feat: add ChatSidePanel component with streaming chat UI"
```

---

### Task 4: Update AskAIButton to Use ChatContext

**Files:**
- Modify: `src/components/AskAIButton/index.tsx`
- Modify: `src/components/AskAIButton/styles.module.css`

- [ ] **Step 1: Update the component**

```tsx
// src/components/AskAIButton/index.tsx
import React from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function AskAIButton(): React.JSX.Element {
  const { isOpen, toggleChat } = useChatContext();
  return (
    <div className={`${styles.wrap} ${isOpen ? styles.active : ''}`} data-navbar-ask-ai>
      <button
        type="button"
        className={styles.btn}
        onClick={toggleChat}
        aria-expanded={isOpen}
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
    </div>
  );
}
```

- [ ] **Step 2: Update CSS with active state**

```css
/* src/components/AskAIButton/styles.module.css */

.wrap {
  display: inline-flex;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--ifm-color-emphasis-300, #ccc);
  border-radius: 999px;
  background: var(--ifm-background-color, #fff);
  color: var(--ifm-font-color-base, #1a1a1a);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn:hover {
  background: var(--ifm-color-emphasis-100, #f0f0f0);
}

.active .btn {
  background: var(--ifm-color-primary-lightest, #e6f0ff);
  border-color: var(--ifm-color-primary, #3578e5);
}

.spark {
  flex-shrink: 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AskAIButton/
git commit -m "refactor: simplify AskAIButton to use ChatContext toggle"
```

---

### Task 5: Update FloatingAskWidget to Use ChatContext

**Files:**
- Modify: `src/components/FloatingAskWidget/index.tsx`
- Modify: `src/components/FloatingAskWidget/styles.module.css`

- [ ] **Step 1: Update the component**

```tsx
// src/components/FloatingAskWidget/index.tsx
import React from 'react';
import styles from './styles.module.css';
import { useChatContext } from '@site/src/context/ChatContext';

export default function FloatingAskWidget(): React.JSX.Element {
  const { isOpen, toggleChat } = useChatContext();
  return (
    <div className={`${styles.wrap} ${isOpen ? styles.active : ''}`}>
      <button
        type="button"
        className={styles.bar}
        onClick={toggleChat}
        aria-label="Ask AI">
        <span className={styles.text}>Ask AI</span>
        <kbd className={styles.kbd}>⌘I</kbd>
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
    </div>
  );
}
```

- [ ] **Step 2: Update CSS**

```css
/* src/components/FloatingAskWidget/styles.module.css */

.wrap {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 90;
}

.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--ifm-color-emphasis-300, #ccc);
  border-radius: 999px;
  background: var(--ifm-background-color, #fff);
  color: var(--ifm-font-color-base, #1a1a1a);
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.bar:hover {
  background: var(--ifm-color-emphasis-100, #f0f0f0);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.active .bar {
  background: var(--ifm-color-primary-lightest, #e6f0ff);
  border-color: var(--ifm-color-primary, #3578e5);
}

.text {
  font-weight: 500;
}

.kbd {
  font-size: 11px;
  padding: 2px 6px;
  border: 1px solid var(--ifm-color-emphasis-300, #ccc);
  border-radius: 4px;
  background: var(--ifm-color-emphasis-100, #f0f0f0);
  font-family: inherit;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FloatingAskWidget/
git commit -m "refactor: simplify FloatingAskWidget to use ChatContext toggle"
```

---

### Task 6: Update Root.js to Wire Up ChatProvider

**Files:**
- Modify: `src/theme/Root.js`

- [ ] **Step 1: Update Root.js**

```js
// src/theme/Root.js — site-wide wrapper. Mounts the floating ask widget and chat provider.
import React from 'react';
import FloatingAskWidget from '@site/src/components/FloatingAskWidget';
import ChatSidePanel from '@site/src/components/ChatSidePanel';
import { ChatProvider } from '@site/src/context/ChatContext';

export default function Root({children}) {
  return (
    <ChatProvider>
      {children}
      <FloatingAskWidget />
      <ChatSidePanel />
    </ChatProvider>
  );
}
```

- [ ] **Step 2: Verify the update**

Run:
```bash
cat /home/b/Development/work/vantage-docs-algolia/src/theme/Root.js
```

Expected: File contains ChatProvider wrapping children, FloatingAskWidget, and ChatSidePanel.

- [ ] **Step 3: Commit**

```bash
git add src/theme/Root.js
git commit -m "feat: wrap app with ChatProvider, mount ChatSidePanel"
```

---

### Task 7: Add Global Keyboard Shortcut (⌘I / Ctrl+I)

**Files:**
- Modify: `src/context/ChatContext.tsx`

- [ ] **Step 1: Add keyboard shortcut to ChatProvider**

```tsx
// Updated ChatProvider in src/context/ChatContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const algoliaProvider = createOpenAICompatible({
  baseURL: 'https://mpyyynenh9.algolia.net/agent-studio/1/agents/3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df/completions?compatibilityMode=ai-sdk-5',
  headers: {
    'x-algolia-application-id': 'MPYYYNENH9',
    'x-algolia-api-key': 'b3cadb2f7da0194ead335c3488237443',
  },
});

interface ChatContextValue {
  isOpen: boolean;
  toggleChat: () => void;
  chat: ReturnType<typeof useChat>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat({
    model: algoliaProvider(''),
  });

  const toggleChat = useCallback(() => {
    setIsOpen((o) => !o);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        toggleChat();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleChat]);

  return (
    <ChatContext.Provider value={{ isOpen, toggleChat, chat }}>
      {children}
    </ChatContext.Provider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/context/ChatContext.tsx
git commit -m "feat: add global keyboard shortcut (Cmd+I / Ctrl+I) to toggle chat"
```

---

### Task 8: Build Verification

- [ ] **Step 1: Run the build**

Run:
```bash
cd /home/b/Development/work/vantage-docs-algolia && just build
```

Expected: Build completes without errors. If there are TypeScript or module resolution errors, fix them.

- [ ] **Step 2: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: resolve any build errors for AI chat integration"
```

---

## Self-Review Checklist

1. **Spec coverage:** All sections from the spec are implemented:
   - [x] Architecture (ChatProvider context)
   - [x] ChatSidePanel UI (side panel, messages, input, streaming)
   - [x] AskAIButton update (context consumer, active state)
   - [x] FloatingAskWidget update (context consumer, active state)
   - [x] AI SDK integration (ChatContext with algoliaProvider)
   - [x] Error handling (error banner, retry button)
   - [x] Keyboard shortcut (⌘I / Ctrl+I)

2. **Placeholder scan:** No TBD/TODO placeholders found.

3. **Type consistency:** `useChatContext` returns `{ isOpen, toggleChat, chat }` — all components use these consistently.

4. **Package installation:** `ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible` all installed in Task 1.
