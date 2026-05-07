// src/theme/Root.js — site-wide wrapper.
import React from 'react';
import FloatingAskWidget from '@site/src/components/FloatingAskWidget';
import ChatSidePanel from '@site/src/components/ChatSidePanel';
import { ChatProvider } from '@site/src/context/ChatContext';

export default function Root({ children }) {
  return (
    <ChatProvider>
      {children}
      <FloatingAskWidget />
      <ChatSidePanel />
    </ChatProvider>
  );
}
