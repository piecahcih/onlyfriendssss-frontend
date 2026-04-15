import React from 'react'

function Premium() {

  const timelineSteps = [
    {
      title: "Today : Start your Free Trial",
      description: "Get instant access to all nearby travellers & upcoming trips!",
      icon: "🔓",
    },
    {
      title: "Day 2 : Trial Reminder",
      description: "You'll get a notification that your trial is ending.",
      icon: "🔔",
    },
    {
      title: "Day 3 : Trial Ends",
      description: "You'll be charged for onlyfriendssss Premium. You can cancel anytime before.",
      icon: "⭐",
    }
  ]
  return (
    <>
      <div className="relative flex w-full max-w-sm gap-4">

        <div className="relative w-14 bg-[#FF7B4C] rounded-full flex flex-col justify-between py-10 items-center shadow-lg">
          <span className="text-white text-xl">🔓</span>
          <span className="text-white text-xl opacity-80">🔔</span>
          <span className="text-white text-xl">⭐</span>
        </div>

        <div className="flex flex-col justify-between py-4 space-y-16">
          {timelineSteps.map((step, index) => (
            <div key={index} className="flex flex-col">
              <h3 className="text-black font-bold text-lg mb-1">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-snug max-w-[200px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
      <div className='text-center'>
        <button className="w-80 bg-[#FF7B4C] hover:bg-[#ff6a33] text-white py-4 rounded-full font-bold text-lg transition-colors shadow-lg mt-10">
          Buy Now
        </button>
      </div>
    </>
  )
}

export default Premium