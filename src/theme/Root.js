// src/theme/Root.js — site-wide wrapper. Mounts the floating ask widget.
import React from 'react';
import FloatingAskWidget from '@site/src/components/FloatingAskWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      <FloatingAskWidget />
    </>
  );
}
