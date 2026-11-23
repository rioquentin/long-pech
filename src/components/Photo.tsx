import Image from "next/image";
import { photos, ui } from "@/lib/content";
import { showTodos } from "@/lib/flags";
import { asset } from "@/lib/site";

export type PhotoId = keyof typeof photos;
type PhotoEntry = { alt: string; brief: string; src?: string };

const SUN: Record<number, [number, number]> = { 0: [1260, 250], 1: [340, 210], 2: [820, 180] };

/**
 * Emplacement photo. Tant que content/fr/photos.json ne donne pas de "src",
 * on affiche une illustration de la colline et le brief de prise de vue.
 */
export function Photo({
  id,
  className = "",
  priority = false,
  sizes = "100vw",
}: {
  id: PhotoId;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const photo: PhotoEntry = photos[id];
  if (photo.src) {
    return (
      <div className={`photo ${className}`}>
        <Image src={asset(photo.src)} alt={photo.alt} fill sizes={sizes} priority={priority} />
      </div>
    );
  }
  const [sx, sy] = SUN[Object.keys(photos).indexOf(id) % 3];
  return (
    <div className={`photo ${className}`} role="img" aria-label={`${ui.photoPlaceholder} : ${photo.alt}`}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="1600" height="900" fill="#E9E1CE" />
        <circle cx={sx} cy={sy} r="54" fill="#F7F1E2" />
        <path d="M0 430 Q260 380 520 410 T1040 380 T1600 400 V900 H0Z" fill="#C3C7AE" />
        <path d="M0 500 Q340 420 700 470 T1600 440 V900 H0Z" fill="#8E9A72" />
        <path d="M0 620 Q420 470 900 520 Q1280 560 1600 500 V900 H0Z" fill="#3F4F36" />
        <g fill="none" stroke="#6F8059" strokeWidth="2" opacity=".8">
          <path d="M-40 700 Q420 520 900 570 Q1280 610 1640 550" />
          <path d="M-40 760 Q420 580 900 630 Q1280 670 1640 610" />
          <path d="M-40 830 Q420 650 900 700 Q1280 740 1640 680" />
          <path d="M-40 910 Q420 730 900 780 Q1280 820 1640 760" />
        </g>
      </svg>
      {showTodos && (
        <p className="photo-brief max-sm:hidden" aria-hidden="true">
          <strong className="uppercase">Photo « {id} »</strong> — {photo.brief}
        </p>
      )}
    </div>
  );
}
