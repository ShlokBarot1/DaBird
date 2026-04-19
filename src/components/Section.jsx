import { motion } from "framer-motion";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  align = "left",
}) {
  return (
    <section id={id} className="relative scroll-mt-28 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          className={[
            "grid gap-10 lg:gap-14",
            align === "center" ? "place-items-center text-center" : "",
          ].join(" ")}
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {eyebrow ? (
              <p className="text-xs tracking-[0.34em] text-white/60">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70">
                {description}
              </p>
            ) : null}
          </motion.div>

          {children ? <div className="w-full">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

