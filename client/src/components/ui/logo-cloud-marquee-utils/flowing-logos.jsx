import { cn } from "@/lib/utils";

export function FlowingLogo({
  children,
  vertical = false,
  repeat = 4,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "group relative flex h-full w-full overflow-hidden p-1 [--duration:10s] [--gap:12px] gap-(--gap)",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={`item-${index}`}
          className={cn("flex shrink-0 gap-(--gap)", {
            "group-hover:paused": pauseOnHover,
            "direction-reverse": reverse,
            "animate-canopy-horizontal flex-row": !vertical,
            "animate-canopy-vertical flex-col": vertical,
          })}
        >
          {children}
        </div>
      ))}
      {applyMask && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 h-full w-full",
            vertical ? "bg-linear-to-b" : "bg-linear-to-r"
          )}
        />
      )}
    </div>
  );
}

function LogoCard({ logo, className, variant = "square" }) {
  return (
    <div
      className={cn(
        "flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-transparent transition-all hover:scale-110 hover:border-[#a7242f] hover:shadow-[0_0_10px_#a7242f40]",
        {
          "h-16 w-16": variant === "square",
          "h-14 w-auto min-w-20 max-w-55 px-5 py-3": variant === "wide",
          "h-auto w-auto p-2": variant === "auto",
        },
        className
      )}
    >
      <img
        src={logo.image}
        alt={logo.name}
        className={cn("rounded-xl", {
          "h-full w-full object-cover": variant === "square",
          "h-full max-h-8 w-auto object-contain": variant === "wide",
          "max-h-12 w-auto object-contain": variant === "auto",
        })}
      />
    </div>
  );
}

export function FlowingLogos({
  data,
  className,
  cardClassName,
  variant = "square",
}) {
  return (
    <div className={cn("w-full overflow-hidden", className)}>
      {[false, true, false].map((reverse, index) => (
        <FlowingLogo
          key={`canopy-${index}`}
          reverse={reverse}
          className="[--duration:30s]"
          pauseOnHover
          applyMask
          repeat={9}
        >
          {data.map((logo) => (
            <LogoCard
              key={logo.name}
              logo={logo}
              variant={variant}
              className={cardClassName}
            />
          ))}
        </FlowingLogo>
      ))}
    </div>
  );
}
