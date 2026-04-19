import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};

// ─── V1: Text characters that fly in from the sides with a 3-D flip ──────────

export const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);

  return (
    <motion.span
      style={{
        display: "inline-block",
        color: "hsla(204.39,79.49%,38.24%,1)",
        width: isSpace ? "0.5ch" : undefined,
        x,
        rotateX,
      }}
    >
      {isSpace ? "\u00A0" : char}
    </motion.span>
  );
};

// ─── V2: Icon images that converge from vertical spread ──────────────────────

export const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [Math.abs(distanceFromCenter) * 50, 0]
  );

  return (
    <motion.img
      src={char}
      alt=""
      style={{
        height: "4rem",
        width: "4rem",
        flexShrink: 0,
        objectFit: "contain",
        willChange: "transform",
        transformOrigin: "center",
        x,
        scale,
        y,
      }}
    />
  );
};

// ─── V3: Icon images with rotation + spread ──────────────────────────────────

export const CharacterV3 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 90, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 50, 0]);
  const y = useTransform(
    scrollYProgress,
    [0, 0.5],
    [-Math.abs(distanceFromCenter) * 20, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.img
      src={char}
      alt=""
      style={{
        height: "4rem",
        width: "4rem",
        flexShrink: 0,
        objectFit: "contain",
        willChange: "transform",
        transformOrigin: "center",
        x,
        rotate,
        y,
        scale,
      }}
    />
  );
};

// ─── Bracket SVG ─────────────────────────────────────────────────────────────

const Bracket = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 27 78"
    style={{ height: "3rem", ...style }}
  >
    <path
      fill="currentColor"
      d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
    />
  </svg>
);

// ─── Main exported scroll animation demo ─────────────────────────────────────

export const Skiper31 = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);
  const targetRef3 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const { scrollYProgress: scrollYProgress2 } = useScroll({ target: targetRef2 });
  const { scrollYProgress: scrollYProgress3 } = useScroll({ target: targetRef3 });

  const text = "Da Bird";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  const icons = [
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/instagram.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tiktok.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/youtube.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/twitter.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/pinterest.svg",
    "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/snapchat.svg",
  ];
  const iconCenterIndex = Math.floor(icons.length / 2);

  const blockStyle: React.CSSProperties = {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    height: "210vh",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#f5f4f3",
    padding: "2vw",
  };

  return (
    <div style={{ width: "100%", backgroundColor: "#fff" }}>
      {/* Block 1 — text characters */}
      <div ref={targetRef} style={blockStyle}>
        <div
          style={{
            width: "100%",
            maxWidth: "56rem",
            textAlign: "center",
            fontSize: "clamp(3rem, 8vw, 6rem)",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "-0.04em",
            color: "#000",
            perspective: "500px",
          }}
        >
          {characters.map((char, index) => (
            <CharacterV1
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* Block 2 — icons converging vertically */}
      <div
        ref={targetRef2}
        style={{
          ...blockStyle,
          marginTop: "-100vh",
          flexDirection: "column",
          gap: "2vw",
        }}
      >
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            fontSize: "1.5rem",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#000",
            margin: 0,
          }}
        >
          <Bracket />
          <span>follow us everywhere</span>
          <Bracket style={{ transform: "scaleX(-1)" }} />
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {icons.map((src, index) => (
            <CharacterV2
              key={index}
              char={src}
              index={index}
              centerIndex={iconCenterIndex}
              scrollYProgress={scrollYProgress2}
            />
          ))}
        </div>
      </div>

      {/* Block 3 — icons with rotation */}
      <div
        ref={targetRef3}
        style={{
          ...blockStyle,
          marginTop: "-95vh",
          flexDirection: "column",
          gap: "2vw",
          perspective: "500px",
        }}
      >
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            fontSize: "1.5rem",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#000",
            margin: 0,
          }}
        >
          <Bracket />
          <span>join the flock</span>
          <Bracket style={{ transform: "scaleX(-1)" }} />
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {icons.map((src, index) => (
            <CharacterV3
              key={index}
              char={src}
              index={index}
              centerIndex={iconCenterIndex}
              scrollYProgress={scrollYProgress3}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
