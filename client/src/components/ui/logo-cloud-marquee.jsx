import { motion } from "motion/react";
import { FlowingLogos } from "@/components/ui/logo-cloud-marquee-utils/flowing-logos";
import { cn } from "@/lib/utils";

const defaultLogos = [
  {
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b65?w=200&h=200&fit=crop",
    name: "Solvents",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581093458791-9d42e2d3393a?w=200&h=200&fit=crop",
    name: "Glycols",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=200&h=200&fit=crop",
    name: "Industrial",
  },
  {
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=200&h=200&fit=crop",
    name: "Technical",
  },
  {
    image:
      "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=200&h=200&fit=crop",
    name: "Carbon",
  },
];

export default function LogoCloudMarquee({
  title = "Built with technologies trusted by",
  description = "ScrollX UI aligns with the ecosystem powering the world's most ambitious products.",
  data = defaultLogos,
  className,
}) {
  const words = title.split(" ");

  return (
    <section className={cn("relative w-full overflow-hidden py-24", className)}>
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-zinc-800 md:text-5xl lg:text-6xl">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-base text-zinc-500 md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative mt-14"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-linear-to-r from-white via-white/60 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-linear-to-l from-white via-white/60 to-transparent" />
          <FlowingLogos
            data={data}
            variant="wide"
            className="[--duration:35s]"
          />
        </motion.div>
      </div>
    </section>
  );
}
