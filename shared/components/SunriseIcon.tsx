import React from 'react';

interface SunriseIconProps {
  className?: string;
}

export const SunriseIcon: React.FC<SunriseIconProps> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 10V2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 4.93-1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 17.66 1.41 1.41" />
    <path d="M16 5H8a6 6 0 0 0-6 6v1a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-1a6 6 0 0 0-6-6Z" />
  </svg>
);
