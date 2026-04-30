// src/components/ProductIcon/index.tsx
//
// Tiny SVG icon set for product/tool headers. Shapes lifted from the
// Vantage AI Workbench design's section-header icons.
import React from 'react';

type IconName =
  | 'workbench' | 'sessions' | 'models' | 'endpoints'
  | 'training-jobs' | 'pipelines' | 'sweeps'
  | 'compute-profiles' | 'observability'
  | 'jobs' | 'storage' | 'clusters'
  | 'compute-providers' | 'federations' | 'iam' | 'teams' | 'licenses';

const PATHS: Record<IconName, React.ReactNode> = {
  workbench: <><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></>,
  sessions: <><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M9 9h6M9 13h4"/></>,
  models: <><path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="M3 8l9 5 9-5M12 13v9"/></>,
  endpoints: <><path d="M4 12h6l3 8 4-16 3 8h0"/></>,
  'training-jobs': <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></>,
  pipelines: <><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M8.5 6h4M8.5 18h4M12.5 6c0 6 3 6 3 6M12.5 18c0-6 3-6 3-6"/></>,
  sweeps: <><path d="M3 17l4-8 4 4 4-10 4 6 2-2"/></>,
  'compute-profiles': <><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/></>,
  observability: <><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 4-8"/></>,
  jobs: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
  storage: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/></>,
  clusters: <><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6M9 18h6M6 9v6M18 9v6"/></>,
  'compute-providers': <><path d="M21 8a4 4 0 0 0-7-3 5 5 0 0 0-9 2 4 4 0 0 0 1 8h13a3 3 0 0 0 2-7z"/></>,
  federations: <><circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l4 3M18 7l-4 3M6 17l4-3M18 17l-4-3"/></>,
  iam: <><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"/></>,
  teams: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a4 4 0 0 1 7-3"/></>,
  licenses: <><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 11h10M7 15h6"/></>,
};

export default function ProductIcon({
  name,
  size = 24,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
