"use client";

import { motion, useReducedMotion } from "motion/react";

export default function AnimatedText({
  text,
  className,
  delay = 0,
  as: Component = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionComponent = motion.create(Component);

  if (reduce) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
      className={className}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-baseline" style={{ paddingBottom: "0.18em", marginBottom: "-0.18em" }}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {word}
            {index < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
}
