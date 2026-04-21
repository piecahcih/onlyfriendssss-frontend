import React from 'react'
import { motion } from 'framer-motion'

function Premium() {
  const timelineSteps = [
    {
      title: "Today: Start Free Trial",
      description: "Get instant access to all nearby travellers & upcoming trips!",
      icon: "🔓",
      color: "bg-orange-400"
    },
    {
      title: "Day 2: Trial Reminder",
      description: "You'll get a notification that your trial is ending.",
      icon: "🔔",
      color: "bg-amber-400"
    },
    {
      title: "Day 3: Trial Ends",
      description: "Enjoy Premium features. Cancel anytime before this date.",
      icon: "⭐",
      color: "bg-yellow-400"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-2">
      <div className="relative flex w-full gap-6 px-4">

        <div className="absolute left-[35px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#FF7B4C] via-amber-200 to-transparent" />

        <div className="flex flex-col space-y-12">
          {timelineSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex gap-5 items-start"
            >
              <div className={`relative z-10 shrink-0 w-10 h-10 ${index === 2 ? 'bg-[#FF7B4C]' : 'bg-white border-2 border-[#FF7B4C]'} rounded-full flex items-center justify-center shadow-md`}>
                <span className="text-lg">{step.icon}</span>
              </div>

              <div className="flex flex-col text-left pt-1">
                <h3 className="text-black font-extrabold text-md tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-10 px-6 py-4 bg-gray-50 rounded-2xl w-full border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Pricing Plan</p>
            <p className="text-gray-800 font-bold">฿299.00 / month</p>
          </div>
          <div className="bg-[#FF7B4C] text-white text-[10px] px-2 py-1 rounded-md font-bold">
            BEST VALUE
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium
