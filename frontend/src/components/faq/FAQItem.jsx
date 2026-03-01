import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center px-8 py-6 text-left rounded-[1.5rem] border transition-all duration-300 ${
          isOpen
            ? "bg-white border-orange-500/30 shadow-xl shadow-[#071E3D]/5"
            : "bg-white border-slate-100 hover:border-orange-500/20 hover:shadow-md"
        }`}
      >
        <span
          className={`text-base md:text-lg font-black tracking-tight transition-colors ${
            isOpen ? "text-orange-500" : "text-[#071E3D]"
          }`}
        >
          {question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`p-2 rounded-full transition-colors ${
            isOpen
              ? "bg-orange-500 text-white"
              : "bg-slate-50 text-slate-400 group-hover:text-[#071E3D]"
          }`}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-8 py-6 text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              <div className="h-[2px] w-12 bg-orange-500 mb-6 rounded-full" />
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}