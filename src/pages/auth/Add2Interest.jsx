import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { addInterests } from '../../api/mainApi';
import { useLocation, useNavigate } from 'react-router';

function Add2Interest() {
  const navigate = useNavigate()
  const location = useLocation()

  const users = location.state?.newUser;

  const interests = [
    "foodie", "camping", "slowlife", "health", "art",
    "travel", "entertainment", "sport", "volunteer", "workstation"
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

  const hdlSubmit = async () => {
    try {
      const res = await addInterests(users?.id, { interests: selected }) // ส่งข้อมูลไปด้วย
      toast.success('บันทึกสำเร็จ')
      navigate('/login')
    } catch (error) {
      console.log(error)
      toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล')
    }
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="m-auto w-full max-w-[375px] h-[700px] rounded-[45px] flex flex-col p-8 relative overflow-hidden">

        <div className="mt-10 mb-8">
          <h1 className="text-[32px] font-black bai-jamjuree-bold leading-tight text-gray-900">
            Pick up to 4<br />interests
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 overflow-y-auto max-h-[400px] no-scrollbar">
          {interests.map((item) => {
            const isSelected = selected.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleInterest(item)}
                style={{ backgroundColor: isSelected ? '#FF7F50' : '#F3F4F6' }}
                className={`px-5 py-2.5 rounded-full bai-jamjuree-bold text-sm transition-all duration-200 active:scale-90
                  ${isSelected ? 'text-white' : 'text-gray-600'}
                `}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6">
          <button
            disabled={selected.length === 0}
            onClick={hdlSubmit}
            style={{ backgroundColor: '#FF7F50' }}
            className={`w-full py-4 text-white rounded-full font-bold text-lg shadow-lg transition-opacity
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
