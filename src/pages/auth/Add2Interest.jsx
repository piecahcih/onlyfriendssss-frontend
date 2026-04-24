import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { addInterests } from '../../api/mainApi';
import { useLocation, useNavigate } from 'react-router';
import useUserStore from '../../stores/userStore';
import { LeftIcon } from '../../icons';

function Add2Interest() {
  const registeringUser = useUserStore(state => state.registeringUser)
  const completeRegistration = useUserStore(state => state.completeRegistration)
  const navigate = useNavigate()

const interests = [
  { label: "foodie 🍳", value: "foodie" },
  { label: "camping 🏕️", value: "camping" },
  { label: "slowlife 🌿", value: "slowlife" },
  { label: "health 🥗", value: "health" },
  { label: "art 🎨", value: "art" },
  { label: "travel ✈️", value: "travel" },
  { label: "sport 🏀", value: "sport" },
  { label: "volunteer 🤝", value: "volunteer" },
  { label: "gaming 🎮", value: "gaming" },

  // Food & Drink
  { label: "cafe hopping ☕", value: "cafe_hopping" },
  { label: "street food 🍢", value: "street_food" },
  { label: "fine dining 🍷", value: "fine_dining" },
  { label: "cooking & baking 👩‍🍳", value: "cooking_baking" },
  { label: "drinks & nightout 🍻", value: "drinks_nightout" },

  // Health & Active
  { label: "gym & workout 💪", value: "gym_workout" },
  { label: "yoga & pilates 🧘‍♀️", value: "yoga_pilates" },
  { label: "running & marathon 🏃", value: "running_marathon" },
  { label: "mental wellness 😌", value: "mental_wellness" },
  { label: "team sports ⚽", value: "team_sports" },

  // Art & Culture
  { label: "museum & gallery 🏛️", value: "museum_gallery" },
  { label: "photography 📸", value: "photography" },
  { label: "crafting & DIY ✂️", value: "crafting_diy" },
  { label: "live music 🎸", value: "live_music" },
  { label: "book club 📚", value: "book_club" },

  // Entertainment & Fun
  { label: "movies & cinema 🍿", value: "movies_cinema" },
  { label: "board games 🎲", value: "board_games" },
  { label: "video games 🕹️", value: "video_games" },
  { label: "karaoke 🎤", value: "karaoke" },
  { label: "concerts & festivals 🎪", value: "concerts_festivals" },

  // Travel & Adventure
  { label: "backpacking 🎒", value: "backpacking" },
  { label: "road trip 🚗", value: "road_trip" },
  { label: "beach vibes 🏖️", value: "beach_vibes" },
  { label: "hiking & trekking 🥾", value: "hiking_trekking" },
  { label: "sightseeing 🗺️", value: "sightseeing" }
];

  // ดักห้ามเลือกเกิน 4 
  const [selected, setSelected] = useState([])
  const toggleInterest = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item))
    } else if (selected.length < 4) {
      setSelected([...selected, item])
    }
  }

  const hdlGoBack = () => {
    navigate('/add-profile');
  }

  const hdlSubmit = async () => {
    try {
      const res = await addInterests(registeringUser?.id, { interests: selected })
      console.log("API Response:", res.data)
      const { user, token } = res.data

      if (user && token) {
        completeRegistration(user, token)

        toast.success('Login Success')
        setTimeout(() => {
          navigate('/welcome')
        }, 1500)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to submit data. Please try again.')
    }
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="mx-auto w-full max-w-[375px] h-[750px] flex flex-col px-4 pt-4 overflow-hidden relative">
        <button
          type="button"
          onClick={hdlGoBack}
          className="text-primary hover:opacity-80 active:scale-95 transition-all absolute -left-1.5"
        >
          <LeftIcon className="w-8 h-8" />
        </button>

        <div className="mt-10 mb-8">
          <h1 className="text-[32px] font-black bai-jamjuree-bold leading-tight text-gray-900">
            Pick up to 4<br />interests
          </h1>
          <p>match activities with your interests</p>
        </div>

        <div className="flex flex-wrap gap-3 overflow-y-auto no-scrollbar mt-5">
          {interests.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <button
                key={item}
                onClick={() => toggleInterest(item.value)}
                style={{ backgroundColor: isSelected ? '#FF7F50' : '#F3F4F6' }}
                className={`px-5 py-2.5 rounded-full bai-jamjuree-bold text-sm transition-all duration-200 active:scale-90
                  ${isSelected ? 'text-white' : 'text-gray-600'}
                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 z-40 w-full p-6">
          <button
            disabled={selected.length === 0}
            onClick={hdlSubmit}
            style={{ backgroundColor: '#FF7F50' }}
            className={`w-full py-4 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-lg shadow-[0_8px_32px_rgba(168,49,0,0.24)] active:scale-95 transition-all hover:scale-[1.05]
              ${selected.length === 0 ? 'opacity-50' : 'opacity-100 active:scale-[0.98]'}
            `}
          >
            continue
          </button>
        </div>

      </div>
    </div>
  );
}

export default Add2Interest
