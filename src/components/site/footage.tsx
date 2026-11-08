import { cn } from "@/lib/utils";
import Image from "next/image";

interface FootageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * A square-cornered 16:10 frame that pulls focus as it crosses the viewport.
 * The blurred copy only animates opacity, so the effect stays cheap.
 */
const Footage = ({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
}: FootageProps) => {
  return (
    <div className={cn("relative aspect-[16/10] overflow-hidden bg-umbra", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      <div aria-hidden className="footage-blur absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          sizes="40vw"
          quality={40}
          className="scale-110 object-cover object-top blur-xl"
        />
      </div>
    </div>
  );
};

export default Footage;
