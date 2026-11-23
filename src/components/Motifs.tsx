/**
 * Les deux motifs propres au domaine (voir DESIGN.md) :
 * - la ligne de crête de la « longue colline », Long Pech en occitan ;
 * - la trajectoire de l'hirondelle, qui relie les gammes et les générations.
 * Décoratifs : toujours masqués aux lecteurs d'écran.
 */

/** Silhouette de l'hirondelle, centrée sur l'origine et tournée vers la droite. */
const SWALLOW =
  "M96 33C90 28 82 27 74 29 66 16 54 6 38 2 48 10 56 22 58 34 48 35 38 36 30 37L2 24C12 32 18 38 22 41 16 46 8 52 0 58L30 45C40 46 48 46 55 45 54 58 50 68 42 79 58 70 68 56 72 43 82 42 90 39 96 33Z";

/** Profil de la colline : une montée douce, un long plateau, une descente plus raide vers le Tarn. */
const CRETE =
  "M0 96 C120 94 210 70 330 52 C470 30 610 22 800 20 C1000 18 1130 26 1250 46 C1340 62 1420 84 1600 90";

/** Ligne de crête, en trait. Sert de séparateur : la largeur suit le conteneur, l'épaisseur reste fixe. */
export function Ridge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 100"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden="true"
    >
      <path d={CRETE} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** La colline en aplat, pour qu'une section sombre se lève comme un horizon (haut du pied de page). */
export function RidgeEdge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1600 100"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden="true"
    >
      <path d={`${CRETE} V100 H0Z`} fill="currentColor" />
    </svg>
  );
}

/**
 * Trajectoire d'hirondelle : un vol pointillé qui finit sur l'oiseau.
 * `dots` place des étapes sur la trajectoire (fractions de la largeur), par exemple une par gamme.
 */
export function Flight({ className = "", dots = [] }: { className?: string; dots?: number[] }) {
  // viewBox 1200 × 120. Sans étapes : une ondulation libre. Avec étapes : la courbe passe exactement par chacune.
  const stops: [number, number][] = dots.length
    ? dots.map((t, i) => [t * 1200, i % 2 ? 84 : 62])
    : [
        [470, 60],
        [880, 86],
      ];
  // Avec étapes, le vol part de la première ; sans, il monte depuis le bas à gauche.
  const points: [number, number][] = dots.length ? [...stops, [1150, 24]] : [[4, 104], ...stops, [1150, 24]];
  return (
    <svg viewBox="0 0 1200 120" className={`block w-full overflow-visible ${className}`} aria-hidden="true">
      <path
        d={smooth(points)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="1 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.7"
      />
      {dots.length > 0 && stops.map(([x, y]) => <circle key={x} cx={x} cy={y} r="4.5" fill="currentColor" />)}
      <path d={SWALLOW} transform="translate(1146 2) rotate(-26) scale(0.42)" fill="currentColor" />
    </svg>
  );
}

/** Courbe lisse passant par tous les points (Catmull-Rom convertie en Bézier cubiques). */
function smooth(pts: [number, number][]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}
