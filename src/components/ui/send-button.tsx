"use client";

import { cn } from '@/lib/utils';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { IoIosPaperPlane } from 'react-icons/io';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { LuLoader } from "react-icons/lu";

interface Props {
    isSent: boolean;
    isLoading: boolean;
    disabled: boolean;
    setIsSent: (isSent: boolean) => void;
}

const SendButton = ({ isSent, isLoading, setIsSent, disabled }: Props) => {

    const iconVariants: Variants = {
        open: {
            opacity: 1, x: 0, y: 0, scale: 1, transition: {
                duration: 0.5,
                bounce: 0.5,
                type: 'spring',
            },
        },
        close: {
            opacity: 0, x: 50, y: -50, scale: 0, transition: {
                duration: 0.5,
                bounce: 0.5,
                type: 'spring',
            }
        },
    };

    const checkMarkVariants: Variants = {
        open: {
            opacity: 1, x: -23, y: 0, scale: 1, transition: {
                duration: 0.5,
                type: 'spring',
                bounce: 0.5,
            }
        },
        close: {
            opacity: 0, x: -50, y: 50, scale: 0, transition: {
                duration: 0.5,
                type: 'spring',
                bounce: 0.5,
            }
        },
    };

    return (
        <AnimatePresence>
            <motion.button
                disabled={disabled || isLoading}
                className="relative py-3 text-[15px] tracking-wider font-medium overflow-hidden rounded-lg bg-[#3b82f6] text-white transition-all duration-300 group btn-primary flex items-center justify-center w-48 h-auto mt-2"
            >
                <span className={cn(
                    "relative z-10 font-medium font-heading",
                    isLoading ? "mr-0" : "mr-2"
                )}>
                    {isLoading ? "Sending..." : isSent ? "Sent" : "Send Message"}
                </span>

                {isLoading ? (
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                    >
                        <LuLoader className="size-5 animate-spin" />
                    </motion.span>
                ) : (
                    <div className="relative flex items-center justify-center">
                        <motion.span
                            animate={isSent ? 'close' : 'open'}
                            initial="open"
                            variants={iconVariants}
                        >
                            <IoIosPaperPlane className="size-5" />
                        </motion.span>
                        <motion.span
                            animate={isSent ? 'open' : 'close'}
                            initial="close"
                            variants={checkMarkVariants}
                            className=""
                        >
                            <IoCheckmarkCircle className="size-5" />
                        </motion.span>
                    </div>
                )}

                <div className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 ease-in-out group-hover:translate-x-[200%] group-hover:duration-1000"></div>
            </motion.button>
            {/* <button className="relative py-3 text-[15px] tracking-wider font-medium overflow-hidden rounded-lg bg-[#3b82f6] text-white transition-all duration-300 group btn-primary flex items-center justify-center w-48 h-auto mt-2">
                <span className="relative z-10 font-medium font-heading">
                    Send Message
                </span>
                <span className="flex items-center justify-center scale-x-0 group-hover:scale-x-100 transition-all duration-300 size-0 group-hover:size-5 ml-1">
                    <ChevronRightIcon className="size-5" />
                </span>
                <div className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 ease-in-out group-hover:translate-x-[200%] group-hover:duration-1000"></div>
            </button> */}
            {/* <motion.button
                type='submit'
                disabled={disabled || isLoading}
                className={buttonVariants({ className: "px-6 w-full md:w-60 cursor-pointer md:px-8 py-2 text-center overflow-hidden bg-white font-semibold rounded-md flex items-center justify-center z-20 space-x-1.5" })}
            >
                <span className={cn(
                    "text-neutral-900",
                    isLoading ? "ml-0" : "ml-5"
                )}>
                    {isLoading ? "Sending..." : isSent ? "Sent" : "Send Message"}
                </span>

                {isLoading ? (
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                    >
                        <LuLoader className="size-5 animate-spin text-neutral-700" />
                    </motion.span>
                ) : (
                    <>
                        <motion.span
                            animate={isSent ? 'close' : 'open'}
                            initial="open"
                            variants={iconVariants}
                            className=""
                        >
                            <IoIosPaperPlane className="size-5 text-neutral-900" />
                        </motion.span>
                        <motion.span
                            animate={isSent ? 'open' : 'close'}
                            initial="close"
                            variants={checkMarkVariants}
                            className=""
                        >
                            <IoCheckmarkCircle className="size-5 text-neutral-900" />
                        </motion.span>
                    </>
                )}
            </motion.button> */}
        </AnimatePresence>
    );
};
// else show conditionally the checkmark icon

export default SendButton;
