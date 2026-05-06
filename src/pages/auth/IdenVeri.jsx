import mockFaceId from "../../assets/Face Id.png"

function IdenVeri() {
  return (
    <div className='bg-base-200 min-h-screen'>
        <div className="flex flex-col items-center pt-14">
            <h1 className='text-primary text-[32px] bai-jamjuree-bold my-8'>onlyfriendssss</h1>
            <img src={mockFaceId} alt="mockIDverify" />
            <p className="bai-jamjuree-semibold w-[250px] text-center">Move your head toward the indicated direction </p>
        </div>
    </div>
  )
}

export default IdenVeri