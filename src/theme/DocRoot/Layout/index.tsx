/**
 * Custom DocRoot Layout that ensures sidebar collapse functionality works
 * across all documentation plugins (/, /cli, /api, /sdk)
 */

import React, {type ReactNode, useState, useEffect} from 'react';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import type {Props} from '@theme/DocRoot/Layout';

import styles from './styles.module.css';

export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  
  // Apply data attributes for CSS targeting when collapse state changes
  useEffect(() => {
    const sidebarContainer = document.querySelector('[class*="docSidebarContainer"], .theme-doc-sidebar-container');
    const mainContainer = document.querySelector('[class*="docMainContainer"]');
    
    if (sidebarContainer) {
      sidebarContainer.setAttribute('data-collapsed', hiddenSidebarContainer.toString());
    }
    if (mainContainer) {
      mainContainer.setAttribute('data-collapsed', hiddenSidebarContainer.toString());
    }
  }, [hiddenSidebarContainer]);
  
  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      <div className={styles.docRoot}>
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocRootLayoutMain>
      </div>
    </div>
  );
}
