import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CloseIcon } from "../../icons/index"
import Premium from "./Premium"

const PremiumModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="text-center">
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full "
                >
                  <CloseIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="mb-8">
                <h1 className="text-[#FF7B4C] text-4xl font-black mb-2 tracking-tighter">
                  onlyfriendssss
                </h1>
                <div className="inline-block bg-[#FF7B4C]/10 px-4 py-1 rounded-full mb-4">
                  <span className="text-[#FF7B4C] text-[10px] font-black uppercase tracking-[3px]">
                    Premium Access
                  </span>
                </div>
                <h2 className="text-black text-lg font-bold leading-tight max-w-[280px] mx-auto">
                  MAKE UNLIMITED TRAVEL WITH <br />
                  <span className="text-[#FF7B4C]">PREMIUM MEMBERSHIP</span>
                </h2>
              </div>

              <Premium isOpen={isOpen} onClose={onClose} />

              <button onClick={onClose}
                className="w-full bg-gradient-to-r from-[#FF7B4C] to-[#ff9570] text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_25px_-5px_rgba(255,123,76,0.4)] mt-6 transition-all"
              >
                START MY FREE TRIAL
              </button>
            </div>
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal
