import * as React from "react";

const LinkedIn = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="3"
      ry="3"
      fill="currentColor"
    />
    <g fill="white">
      {/* "i" - dot */}
      <circle cx="8.5" cy="9.5" r="1.2"/>
      {/* "i" - stem */}
      <rect x="7.5" y="11.5" width="2" height="5" rx="0.5"/>
      {/* "n" */}
      <path d="M13 11.5h-1.5v5h1.5v-2c0-1.1.9-2 2-2s2 .9 2 2v2h1.5v-2c0-1.9-1.6-3.5-3.5-3.5S13 9.6 13 11.5z"/>
    </g>
  </svg>
);

export default LinkedIn;
