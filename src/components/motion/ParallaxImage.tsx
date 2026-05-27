"use client";

import Image, { type ImageProps } from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";

type Props = ImageProps & {
  parallaxStrength?: number;
  wrapperClassName?: string;
};

export default function ParallaxImage({
  parallaxStrength = 80,
  wrapperClassName,
  className,
  ...imageProps
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -parallaxStrength, reduce ? 0 : parallaxStrength]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${wrapperClassName ?? ""}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0 h-[120%]">
        <Image {...imageProps} className={`object-cover ${className ?? ""}`} alt={imageProps.alt} />
      </motion.div>
    </div>
  );
}
