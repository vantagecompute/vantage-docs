import React from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import IconClose from '@theme/Icon/Close';
import NavbarLogo from '@theme/Navbar/Logo';
import AskAIButton from '@site/src/components/AskAIButton';
import { useChatContext } from '@site/src/context/ChatContext';

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
        message: 'Close navigation bar',
        description: 'The ARIA label for close button of mobile sidebar',
      })}
      className="clean-btn navbar-sidebar__close"
      onClick={() => mobileSidebar.toggle()}>
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  );
}

export default function NavbarMobileSidebarHeader() {
  const mobileSidebar = useNavbarMobileSidebar();
  const { openChat } = useChatContext();

  const handleAskAI = () => {
    mobileSidebar.toggle();
    openChat();
  };

  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <NavbarColorModeToggle className="margin-right--md" />
      <div className="margin-right--md">
        <AskAIButton onClick={handleAskAI} />
      </div>
      <CloseButton />
    </div>
  );
}
