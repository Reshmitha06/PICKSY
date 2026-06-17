export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="logo-shine" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Rounded square background */}
      <rect x="0" y="0" width="40" height="40" rx="12" fill="url(#logo-grad)" />
      <rect x="0" y="0" width="40" height="40" rx="12" fill="url(#logo-shine)" />
      {/* Magnifying glass + spark — represents "pick smartly" */}
      <circle cx="18" cy="17" r="7.5" stroke="white" strokeWidth="2.5" fill="none" />
      <line x1="23.5" y1="22.5" x2="30" y2="29" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Spark/star inside the lens */}
      <path
        d="M18 13 L19 15.5 L21.5 14.5 L19.5 16.5 L21.5 18.5 L19 17.5 L18 20 L17 17.5 L14.5 18.5 L16.5 16.5 L14.5 14.5 L17 15.5 Z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}
