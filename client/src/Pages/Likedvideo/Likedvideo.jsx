import WHL from "../../Component/WHL/WHL"
import { useSelector } from "react-redux"
const Likedvideo = () => {
  const likedvideolist = useSelector((state) => state.likedvideoreducer)
  console.log(likedvideolist)

  return <WHL page={"Liked Video"} videolist={likedvideolist} />
}

export default Likedvideo
