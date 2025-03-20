import { cn } from "@/lib/utils";
import {
    AnimatePresence,
    MotionValue,
    motion,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ListCollapseIcon, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export const FloatingDock = ({
    items,
    desktopClassName,
    mobileClassName,
}: {
    items: { name: string; icon: LucideIcon; href: string }[];
    desktopClassName?: string;
    mobileClassName?: string;
}) => {
    return (
        <>
            <FloatingDockDesktop items={items} className={desktopClassName} />
            <FloatingDockMobile items={items} className={mobileClassName} />
        </>
    );
};

const FloatingDockMobile = ({
    items,
    className,
}: {
    items: { name: string; icon: LucideIcon; href: string }[];
    className?: string;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={cn("relative block md:hidden", className)}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        layoutId="nav"
                        className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
                    >
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    transition: {
                                        delay: idx * 0.05,
                                    },
                                }}
                                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                            >
                                <Link
                                    href={item.href}
                                    key={item.name}
                                    className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center"
                                >
                                    <item.icon className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <button
                onClick={() => setOpen(!open)}
                className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
            >
                <ListCollapseIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            </button>
        </div>
    );
};

const FloatingDockDesktop = ({
    items,
    className,
}: {
    items: { name: string; icon: LucideIcon; href: string }[];
    className?: string;
}) => {
    let mouseX = useMotionValue(Infinity);
    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "mx-auto flex gap-2 items-center rounded-2xl bg-[#191919] p-1.5",
                className
            )}
        >
            {items.map((item) => (
                <IconContainer mouseX={mouseX} key={item.name} {...item} />
            ))}
        </motion.div>
    );
};

function IconContainer({
    mouseX,
    name,
    icon: Icon,
    href,
}: {
    mouseX: MotionValue;
    name: string;
    icon: LucideIcon;
    href: string;
}) {

    const pathname = usePathname();

    return (
        <Link href={href}>
            <div className="aspect-square rounded-xl flex items-center justify-center relative p-2">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger className="z-20">
                            <Icon className="size-5" />
                        </TooltipTrigger>
                        <TooltipContent sideOffset={20} className="px-2 py-1 text-xs">
                            {name}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {href === pathname && (
                    <motion.span
                        layoutId='activeLink'
                        transition={{
                            type: "spring",
                            bounce: 0.2,
                        }}
                        className="absolute inset-0 size-9 -z-1 rounded-xl bg-neutral-800"
                    ></motion.span>
                )}
            </div>
        </Link>
    );
};
