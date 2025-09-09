import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import type {WrapperProps} from '@docusaurus/types';
import type DocSidebarType from '@theme/DocSidebar';

type Props = WrapperProps<typeof DocSidebarType>;

export default function DocSidebarWrapper(props: Props): React.JSX.Element {
  // Simply pass through the props to the original DocSidebar
  // Each platform section has its own configured sidebar
  return <DocSidebar {...props} />;
}
