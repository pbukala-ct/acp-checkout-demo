export function CtLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="commercetools"
    >
      <rect width="36" height="36" rx="7" fill="#FFC82B" />
      {/* Stylised "ct" mark */}
      <path
        d="M11 13.5 C11 11.0 13.0 9 15.5 9 L20 9 L20 12 L15.5 12 C14.67 12 14 12.67 14 13.5 L14 22.5 C14 23.33 14.67 24 15.5 24 L20 24 L20 27 L15.5 27 C13.0 27 11 24.99 11 22.5 Z"
        fill="#1A1A1A"
      />
      <path
        d="M22 9 L25 9 L25 15 L27 15 L27 18 L25 18 L25 27 L22 27 L22 18 L20 18 L20 15 L22 15 Z"
        fill="#1A1A1A"
      />
    </svg>
  );
}

export function CtWordmark({ height = 20 }: { height?: number }) {
  return (
    <svg
      height={height}
      viewBox="0 0 160 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="commercetools"
    >
      <text
        x="0"
        y="18"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="18"
        fontWeight="600"
        fill="white"
        letterSpacing="-0.3"
      >
        commerce
        <tspan fill="#FFC82B">tools</tspan>
      </text>
    </svg>
  );
}
