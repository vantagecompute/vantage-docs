// src/theme/DocItem/Layout/index.tsx
//
// Wraps the original DocItem layout to inject a page header (title +
// description + Copy MCP Server button) above the standard content.
// Title/description come from the doc's frontmatter.
import React from 'react';
import OriginalLayout from '@theme-original/DocItem/Layout';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import CopyMcpServerButton from '@site/src/components/CopyMcpServerButton';
import styles from './styles.module.css';

export default function LayoutWrapper(props: any): React.JSX.Element {
  const {metadata, frontMatter} = useDoc();
  const title = (frontMatter as any).title ?? metadata.title;
  const description = (frontMatter as any).description ?? metadata.description ?? '';

  return (
    <>
      <header className={styles.pageHeader}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {description ? <p className={styles.desc}>{description}</p> : null}
        </div>
        <div className={styles.actions}>
          <CopyMcpServerButton />
        </div>
      </header>
      <OriginalLayout {...props} />
    </>
  );
}
