import defaultProfile from "../../assets/default-profilepic.jpg"

function ProfilePic(props) {
    const {imgSrc, menu, bottom, right, ...restProps} = props

  return (
    <div className="avatar items-center cursor-pointer">
        <div {...restProps}>
            <img src={imgSrc ? imgSrc : defaultProfile} alt="avatar" />
        </div>
    </div>
  )
}

export default ProfilePic