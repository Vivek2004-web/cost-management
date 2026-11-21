import React from 'react';

export function AwsLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AWS Logo"
    >
      {/* AWS Smile Arrow */}
      <path
        d="M48.2 41.6c-7.3 5.4-17.9 8.3-27.1 8.3-12.8 0-24.3-4.7-33-12.5-.7-.6-.1-1.4.7-1 8.7 5.1 19.5 8.1 30.6 8.1 8.3 0 17.5-2.3 25.8-7.1.9-.6 1.8.4 1.2 1.2z"
        fill="#FF9900"
      />
      <path
        d="M51.8 38.2c-.9-1.2-5.9-.6-8.2-.3-.7.1-.8-.5-.2-.9 3.9-2.7 10.3-1.9 11.2-.8 1 1.2-.3 7.6-4 10.5-.6.5-1.1.2-.8-.4 1.1-2.1 2.9-6.9 2-8.1z"
        fill="#FF9900"
      />
      {/* AWS text */}
      <path
        d="M17.4 33.1c0 2.2-.4 3.9-1.3 5.1-.9 1.2-2.3 1.8-4.1 1.8-1.5 0-2.8-.5-3.8-1.5v4.2H4.4V24.5h3.6v1.7c1-1.3 2.3-2 3.9-2 1.8 0 3.2.6 4.1 1.9.9 1.3 1.4 3.1 1.4 5.3v1.7zm-3.8-.4c0-1.4-.2-2.5-.7-3.2-.5-.7-1.3-1.1-2.3-1.1-1 0-1.7.4-2.2 1.1-.5.7-.7 1.8-.7 3.2v.7c0 1.4.2 2.5.7 3.2.5.7 1.2 1.1 2.2 1.1 1 0 1.8-.4 2.3-1.1.5-.7.7-1.8.7-3.2v-.7z"
        fill="#FFFFFF"
      />
      <path
        d="M33.7 39.7h-3.7l-4.1-14.8h3.9l2.4 10.4 2.4-10.4h3.7l2.4 10.4 2.4-10.4h3.8L42.7 39.7H39l-2.6-10.6-2.7 10.6z"
        fill="#FFFFFF"
      />
      <path
        d="M59.4 36.2c0 1.2-.4 2.1-1.2 2.8-.8.7-1.9 1-3.3 1-1.4 0-2.8-.4-4.2-1.2v-3.4c1.4 1 2.7 1.5 3.9 1.5.7 0 1.2-.2 1.6-.5.4-.3.6-.7.6-1.3 0-.5-.2-.9-.6-1.2-.4-.3-1.1-.7-2.1-1.1-1.5-.6-2.5-1.3-3.1-2.1-.6-.8-.9-1.8-.9-2.9 0-1.2.4-2.1 1.2-2.8.8-.7 1.9-1 3.2-1 1.2 0 2.4.3 3.7.9l-1.1 2.9c-1.1-.6-2.1-.9-3-.9-.6 0-1.1.2-1.4.5-.3.3-.5.7-.5 1.2 0 .5.2.9.6 1.2.4.3 1.1.7 2.1 1.1 1.5.6 2.5 1.3 3.1 2.1.6.7.9 1.7.9 2.9z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function AzureLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Microsoft Azure Logo"
    >
      <path
        d="M35.6 11.2L22.8 35.8l11.4 12.1h15.8L35.6 11.2z"
        fill="#0089D6"
      />
      <path
        d="M22.8 35.8L8.2 53.4h19.8l6.1-6.5-11.3-11.1z"
        fill="#005BA1"
      />
      <path
        d="M35.6 11.2l-6.7 14.3 11.6 11.8 9.5-26.1H35.6z"
        fill="#50E6FF"
      />
    </svg>
  );
}

export function GcpLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Google Cloud Platform Logo"
    >
      {/* Top blue curve */}
      <path
        d="M39.6 19.8c-3.1 0-5.9 1.3-7.9 3.4-1.2-1.3-2.9-2.2-4.8-2.2-3.6 0-6.6 2.9-6.6 6.5 0 .5.1 1 .2 1.4-4.5 1.1-7.8 5.1-7.8 10 0 5.7 4.6 10.3 10.3 10.3h26.4c5.7 0 10.3-4.6 10.3-10.3 0-5.3-4-9.7-9.2-10.2-.4-5-4.6-8.9-9.6-8.9z"
        fill="#4285F4"
      />
      {/* Inner White cloud cut */}
      <path
        d="M39.6 23.8c3.2 0 5.9 2.4 6.3 5.6l.3 2.6 2.6.3c3.2.4 5.6 3.1 5.6 6.4 0 3.5-2.9 6.4-6.4 6.4H21.6c-3.5 0-6.4-2.9-6.4-6.4 0-3 2.1-5.6 5.1-6.2l2.5-.5.6-2.5c.6-2.4 2.8-4.2 5.3-4.2 1.3 0 2.5.5 3.5 1.4l1.9 1.9 2-1.8c1-1.9 2-3 3.5-3z"
        fill="#FFFFFF"
      />
      {/* Color arcs inside GCP */}
      <path
        d="M39.6 27.2c2.1 0 3.8 1.4 4.3 3.3l.3 1.2 1.2.2c2 .3 3.4 2 3.4 4.1 0 2.3-1.9 4.2-4.2 4.2H23.5c-2.3 0-4.2-1.9-4.2-4.2 0-2 1.3-3.7 3.3-4.1l1.2-.2.3-1.2c.4-1.6 1.9-2.8 3.6-2.8.9 0 1.8.4 2.4 1.1l1.4 1.4 1.4-1.4c.8-1 1.9-1.5 3.2-1.5z"
        fill="#EA4335"
      />
      <circle cx="27" cy="35" r="3" fill="#FBBC05" />
      <circle cx="36" cy="35" r="3.5" fill="#34A853" />
    </svg>
  );
}

export default function ProviderLogo({ provider = 'AWS', size = 24, className = '' }) {
  const norm = (provider || '').toUpperCase();
  if (norm.includes('AWS') || norm.includes('AMAZON')) {
    return <AwsLogo size={size} className={className} />;
  }
  if (norm.includes('AZURE') || norm.includes('MICROSOFT')) {
    return <AzureLogo size={size} className={className} />;
  }
  if (norm.includes('GCP') || norm.includes('GOOGLE')) {
    return <GcpLogo size={size} className={className} />;
  }
  return null;
}
