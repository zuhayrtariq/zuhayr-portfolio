"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, Variants, motion } from "framer-motion";
import { IoIosPaperPlane } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";

interface Props {
  isSent: boolean;
  isLoading: boolean;
  disabled: boolean;
  setIsSent: (isSent: boolean) => void;
}

const SendButton = ({ isSent, isLoading, setIsSent, disabled }: Props) => {
  return (
    <AnimatePresence>
      <motion.button
        disabled={disabled || isLoading}
        className="p-[3px] relative "
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2 flex gap-1 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
          {isLoading ? "Sending..." : isSent ? "Sent" : "Send Message"}

          {isLoading ? (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            >
              <LuLoader className="size-5 animate-spin" />
            </motion.span>
          ) : (
            <div className="relative flex items-center justify-center ">
              <motion.span hidden={isSent}>
                <IoIosPaperPlane className="size-5" />
              </motion.span>
              <motion.span hidden={!isSent}>
                <IoCheckmarkCircle className="size-5" />
              </motion.span>
            </div>
          )}
        </div>
      </motion.button>
    </AnimatePresence>
  );
};

export default SendButton;
