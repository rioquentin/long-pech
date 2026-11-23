/** Hirondelle en vol, emblème du domaine. Motif décoratif : toujours masqué aux lecteurs d'écran. */
export function Swallow({ className = "h-4" }: { className?: string }) {
  return (
    <svg viewBox="-6 -14 112 108" className={`w-auto flex-none fill-current ${className}`} aria-hidden="true">
      <path
        transform="rotate(-18 50 40)"
        d="M96 33C90 28 82 27 74 29 66 16 54 6 38 2 48 10 56 22 58 34 48 35 38 36 30 37L2 24C12 32 18 38 22 41 16 46 8 52 0 58L30 45C40 46 48 46 55 45 54 58 50 68 42 79 58 70 68 56 72 43 82 42 90 39 96 33Z"
      />
    </svg>
  );
}
