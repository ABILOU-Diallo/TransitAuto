// src/components/Watermark.tsx
// Filigrane diagonal "Imperial China Export" affiché en surimpression sur les images de véhicules.
// Utilise uniquement CSS/SVG inline — aucune dépendance externe.

import React from 'react';

interface WatermarkProps {
  /** Texte du filigrane (défaut : "Imperial China Export") */
  text?: string;
  /** Opacité globale du filigrane (0-1, défaut : 0.28) */
  opacity?: number;
  /** Nombre de répétitions du texte sur la diagonale (défaut : 1) */
  repeat?: number;
  /** Taille de police en rem (défaut : 2.4) */
  fontSize?: number;
}

/**
 * Filigrane en diagonale positionné en absolu dans son conteneur parent.
 * Le conteneur parent doit avoir `position: relative` et `overflow: hidden`.
 *
 * Usage :
 * ```tsx
 * <div style={{ position: 'relative', overflow: 'hidden' }}>
 *   <img src="..." />
 *   <Watermark />
 * </div>
 * ```
 */
const Watermark: React.FC<WatermarkProps> = ({
  text = 'Imperial China Export',
  opacity = 0.28,
  repeat = 1,
  fontSize = 2.4,
}) => {
  return (
    <div
      aria-hidden="true"
      style={{
        /* Couvre toute la zone de l'image */
        position: 'absolute',
        inset: 0,
        /* Empêche les clics sur le filigrane */
        pointerEvents: 'none',
        /* Couche au-dessus de l'image mais sous les badges (z-index: 10) */
        zIndex: 5,
        /* Conteneur flex centré pour aligner les lignes diagonales */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.6em',
        overflow: 'hidden',
        /* Rotation diagonale de 45° sur l'ensemble du groupe */
        transform: 'rotate(-40deg)',
        /* Élargit la zone de rotation pour qu'elle couvre bien les coins */
        width: '160%',
        height: '160%',
        marginLeft: '-30%',
        marginTop: '-30%',
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <span
          key={i}
          style={{
            /* Style typographique du filigrane */
            fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
            fontSize: `${fontSize}rem`,
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            color: '#FFFFFF',
            opacity,
            /* Contour fin pour lisibilité sur fond clair comme sombre */
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            WebkitTextStroke: '0.5px rgba(0,0,0,0.3)',
            userSelect: 'none',
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};

export default Watermark;

