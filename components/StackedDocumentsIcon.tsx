import React from 'react';

const StackedDocumentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {/* Back document: A simple rectangle */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25H8.25C7.00736 5.25 6 6.25736 6 7.5V18.75C6 19.9926 7.00736 21 8.25 21H15.75C16.9926 21 18 19.9926 18 18.75V7.5C18 6.25736 16.9926 5.25 15.75 5.25Z" />
    {/* Front document with dog-ear: Path for a rectangle with top-right corner cut for dog-ear, then path for the dog-ear itself */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3H16.5L20.25 6.75V17.25C20.25 18.4926 19.2426 19.5 18 19.5H9.75C8.50736 19.5 7.5 18.4926 7.5 17.25V4.5C7.5 3.67157 8.17157 3 9.75 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3V6.75H20.25" /> {/* Dog-ear triangle */}
  </svg>
);

export default StackedDocumentsIcon;
