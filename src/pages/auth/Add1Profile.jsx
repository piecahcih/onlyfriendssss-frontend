import defaultProfile from "../../assets/default-profilepic.jpg"
import ProfilePic from "../../components/profile/ProfilePic"
import { PhotoIcon } from "../../icons"

function Add1Profile() {

    const inpStyle = 'border border-neutral/50 rounded-[18px] px-5 py-2 w-[315px]'
    const checkboxStyle = 'flex bg-secondary text-white w-[90px] items-center justify-between px-2.5 rounded-[12px]'
    return (
        <div className='bg-base-200 min-h-screen'>
            <div className="flex flex-col items-center pt-8">
                <div className="relative group cursor-pointer h-[200px] w-[200px] my-5">
                    <ProfilePic className="rounded-full h-[200px] w-[200px] border-4 border-primary" />

                    <div onClick={() => document.getElementById('fileInput').click()}
                        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 border-4 border-white rounded-full group-hover:opacity-80 bg-base-content transition-opacity duration-300">
                        <PhotoIcon className="text-white w-10 h-10" />
                    </div>

                    <input type="file" id="fileInput" className="hidden" />
                    {/* onChange={hdlFileChange} */}
                </div>
                {/* <img src={defaultProfile} alt="profilepic" className="rounded-full h-[200px] w-[200px] border border-white border-2 my-5" />   */}


                <div className="flex flex-col items-start gap-3">
                    <div className="flex flex-col gap-1.5">
                        <h3 className='bai-jamjuree-semibold'>Username</h3>
                        <input type="text" placeholder="Username"
                            className={inpStyle} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h3 className='bai-jamjuree-semibold'>FirstName</h3>
                        <input type="text" placeholder="FirstName"
                            className={inpStyle} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h3 className='bai-jamjuree-semibold'>Lastname</h3>
                        <input type="text" placeholder="Lastname"
                            className={inpStyle} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h3 className='bai-jamjuree-semibold'>Gender</h3>
                        <div className="flex gap-4 justify-between">
                            <div className={checkboxStyle}>
                                <p>Male</p>
                                <input type="radio" />
                            </div>
                            <div className={checkboxStyle}>
                                <p>Female</p>
                                <input type="radio" />
                            </div>
                            <div className={checkboxStyle}>
                                <p>Others</p>
                                <input type="radio" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                        <h3 className='bai-jamjuree-semibold'>Tell us about your self</h3>
                        <textarea id='description' placeholder="What's your interest?"
                            className="border border-neutral/50 w-full p-3 rounded-[12px] ">
                        </textarea>
                    </div>
                </div>
                <button className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-8">Complete</button>
            </div>
        </div>
    )
}

export default Add1Profile