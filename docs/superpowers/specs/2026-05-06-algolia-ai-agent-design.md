# Algolia AI Agent — Design Spec

Date: 2026-05-06

## Overview

Replace the placeholder "Ask AI" components (navbar button + floating widget) with a working AI chat interface powered by Algolia Agent Studio. Uses the Vercel AI SDK for streaming chat, shared via React context between both entry points, rendered as a slide-out side panel.

**Agent credentials (client-safe search-only key):**
- Agent ID: `3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df`
- Algolia App ID: `MPYYYNENH9`
- Algolia API Key: `b3cadb2f7da0194ead335c3488237443`
- Index: `VantageComputeDocsWebCrawler`
- Endpoint: `https://mpyyynenh9.algolia.net/agent-studio/1/agents/3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df/completions?compatibilityMode=ai-sdk-5`

## Architecture

```
Root.js
  └── ChatProvider (React context)
        ├── AskAIButton        — navbar toggle button
        ├── FloatingAskWidget  — bottom bar toggle button
        └── ChatSidePanel     — slide-out side panel
```

- `ChatProvider` wraps `{children}` in `Root.js`
- Holds `isOpen: boolean` (panel visibility) and `chat` (return value of `useChat`)
- `AskAIButton` and `FloatingAskWidget` consume context to toggle open/close
- `ChatSidePanel` renders the full chat UI; stays mounted always, hidden via CSS when closed
- Chat history persists across open/close since `useChat` state lives in the provider

## ChatSidePanel UI

Fixed-position overlay on the right side of the screen:

- **Container**: `position: fixed; right: 0; top: 0; height: 100vh; width: 400px;` with CSS slide transition; z-index above content but below modals
- **Header**: "Ask AI" title + close (X) button calling `toggleChat()`
- **Messages area**: scrolls vertically, renders `chat.messages`; user messages right-aligned, AI messages left-aligned
- **Streaming**: Vercel AI SDK streams via `chat.messages` automatically; show typing indicator via `chat.isLoading`
- **Input area**: text input + send button at bottom; uses `chat.handleInputChange` + `chat.handleSubmit`; disabled while `chat.isLoading`
- **Empty state**: when no messages, show "Ask a question about Vantage Compute..."
- **Styling**: CSS module (`styles.module.css`), matches site design tokens from `src/css/custom.css`

## AskAIButton + FloatingAskWidget Updates

Both components currently have local placeholder state. They become thin context consumers:

**AskAIButton** (navbar):
- Remove local `open` state and popover JSX
- On click: call `toggleChat()` from context
- Button text stays "Ask AI" with sparkle icon
- Add `.active` class when `isOpen === true`

**FloatingAskWidget** (bottom of page):
- Remove local `hint` state and form submission logic
- On click: call `toggleChat()` from context
- Simplify to a button/bar saying "Ask AI" with `⌘I` hint
- Add active state indicator when `isOpen === true`

## AI SDK Integration

**Dependencies to install:**
```
npm install ai @ai-sdk/react @ai-sdk/openai-compatible
```

**Why `@ai-sdk/openai-compatible`**: Algolia Agent Studio exposes an OpenAI-compatible endpoint (`compatibilityMode=ai-sdk-5`), so we use the OpenAI-compatible provider.

**ChatProvider core setup:**
```tsx
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { useChat } from '@ai-sdk/react';

const algoliaProvider = createOpenAICompatible({
  baseURL: 'https://mpyyynenh9.algolia.net/agent-studio/1/agents/3d432b4c-51a5-433b-8cc2-3fb2ac9ed3df/completions?compatibilityMode=ai-sdk-5',
  headers: {
    'x-algolia-application-id': 'MPYYYNENH9',
    'x-algolia-api-key': 'b3cadb2f7da0194ead335c3488237443',
  },
});

function ChatProvider({ children }) {
  const chat = useChat({
    model: algoliaProvider(''), // model configured server-side in Algolia
  });
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(o => !o);
  // ...
}
```

The API key is search-only (safe for client-side). Streaming works out of the box with `useChat`.

## Error Handling + Edge Cases

- **Network errors**: `chat.error` is set by Vercel AI SDK on failed requests. Show inline error banner: "Sorry, something went wrong. Please try again." with retry via `chat.reload()`.
- **Empty input**: Disable send button when input is empty or only whitespace.
- **Rate limiting / API errors**: Algolia may return 429 or other errors. Display error message from `chat.error`.
- **Panel closed during streaming**: Request continues in background (Vercel AI SDK handles this). Partial messages visible on re-open.
- **Keyboard shortcut**: `⌘I` / `Ctrl+I` globally toggles the chat panel. Register in `ChatProvider` via `useEffect` + keydown listener.
- **SSR safety**: `useChat` is client-side only. Wrap `ChatProvider` usage with `BrowserOnly` from `@docusaurus/core` if SSR issues arise.

## File Structure

```
src/
  context/
    ChatContext.tsx          — ChatProvider + context definition
  components/
    AskAIButton/
      index.tsx              — simplified: consume ChatContext, toggle only
      styles.module.css      — updated for active state
    FloatingAskWidget/
      index.tsx              — simplified: consume ChatContext, toggle only
      styles.module.css      — updated for active state
    ChatSidePanel/
      index.tsx              — full chat UI (messages, input, streaming)
      styles.module.css      — panel layout, slide animation, message styles
  theme/
    Root.js                  — wrap children with <ChatProvider>
```

## Dependencies

Add to `package.json`:
- `ai`
- `@ai-sdk/react`
- `@ai-sdk/openai-compatible`

No changes to `docusaurus.config.js` Algolia search config — existing search remains untouched.
