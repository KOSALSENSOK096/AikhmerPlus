import React from 'react';

const StylizedCopyButtonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 32 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props} aria-hidden="true">
    {/* Main body with feet and top part for curl */}
    <path d="M7 6C7 4.34315 8.34315 3 10 3H20V9H25V30H22V34H24V36H22V34H10V36H8V34H10V30H7V6Z" />
    {/* Curl part - overlaps with main body's top right */}
    <path d="M20 3H22C23.6569 3 25 4.34315 25 6V9H20V3Z" />
    {/* Horizontal lines */}
    <rect x="10" y="11" width="12" height="2.5" rx="1" />
    <rect x="10" y="17" width="12" height="2.5" rx="1" />
    <rect x="10" y="23" width="12" height="2.5" rx="1" />
  </svg>
);

export default StylizedCopyButtonIcon;