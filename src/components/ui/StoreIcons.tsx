// SVG store icons as React components
export function AmazonIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#FF9900" />
      <path
        d="M13.96 14.29c-1.52 1.12-3.72 1.72-5.62 1.72-2.66 0-5.05-1-6.87-2.64-.14-.13-.02-.3.15-.2 1.96 1.14 4.38 1.82 6.88 1.82 1.69 0 3.54-.35 5.25-1.08.26-.11.47.17.21.38z"
        fill="#232F3E"
      />
      <path
        d="M14.57 13.57c-.19-.25-1.28-.12-1.77-.06-.15.02-.17-.11-.04-.2.87-.61 2.29-.43 2.45-.23.17.21-.04 1.65-.86 2.34-.12.1-.24.05-.18-.09.18-.44.58-1.51.4-1.76z"
        fill="#232F3E"
      />
      <text x="5" y="13" fontSize="7" fill="#232F3E" fontWeight="bold" fontFamily="sans-serif">a</text>
    </svg>
  );
}

export function FlipkartIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#2874F0" />
      <text x="6" y="16" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif">F</text>
    </svg>
  );
}

export function CromaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#00A651" />
      <text x="5" y="16" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif">C</text>
    </svg>
  );
}

export function RelianceDigitalIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#E31E25" />
      <text x="5" y="16" fontSize="10" fill="white" fontWeight="bold" fontFamily="sans-serif">R</text>
    </svg>
  );
}

export function VijaySalesIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#F5A623" />
      <text x="5" y="16" fontSize="10" fill="white" fontWeight="bold" fontFamily="sans-serif">V</text>
    </svg>
  );
}

export const STORE_ICONS: Record<string, React.FC<{ size?: number }>> = {
  amazon: AmazonIcon,
  flipkart: FlipkartIcon,
  croma: CromaIcon,
  "reliance-digital": RelianceDigitalIcon,
  "vijay-sales": VijaySalesIcon,
};

export function StoreIcon({ store, size = 20 }: { store: string; size?: number }) {
  const Icon = STORE_ICONS[store];
  if (Icon) return <Icon size={size} />;
  // Fallback
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#52525B" />
      <text x="6" y="16" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif">
        {store.charAt(0).toUpperCase()}
      </text>
    </svg>
  );
}
