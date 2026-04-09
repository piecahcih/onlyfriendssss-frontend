import defaultProfile from "../../assets/default-profilepic.jpg"

function Add1Profile() {

  const inpStyle = 'border border-neutral/50 rounded-[18px] px-5 py-2 w-[315px]'
  return (
    <div className='bg-base-200 min-h-screen'>
        <div className="flex flex-col items-center pt-14">
            <img src={defaultProfile} alt="profilepic" 
            className="rounded-full h-[200px] w-[200px] border border-white border-2 my-5" />       
            <div className="flex flex-col items-start gap-4">
                <div className="flex flex-col gap-1.5">
                    <h3 className='bai-jamjuree-semibold'>Username</h3>
                    <input type="text" placeholder="Username" 
                    className={inpStyle}/>
                </div>
                <div className="flex flex-col gap-1.5">
                    <h3 className='bai-jamjuree-semibold'>Gender</h3>
                    <div className="flex">
                        <div className="flex gap-2">
                            <input type="checkbox"/>
                            <p>Male</p>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox"/>
                            <p>Female</p>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox"/>
                            <p>Non-binary</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className='bai-jamjuree-semibold'>Tell us about your self</h3>    
                    <textarea id='description' placeholder="What's your interest?" 
                    className="border border-neutral/50 ">
                    </textarea>    
                </div>
            </div>
            <button className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-8">Complete</button>
        </div>
    </div>
  )
}

export default Add1Profile