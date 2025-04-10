import { Routes, Route } from "react-router-dom"
import Home from "./Pages/Home/Home"
import Search from "./Pages/Search/Search"
import Videopage from "./Pages/Videopage/Videopage"
import Channel from "./Pages/Channel/Channel"
import Library from "./Pages/Library/Library"
import Likedvideo from "./Pages/Likedvideo/Likedvideo"
import Watchhistory from "./Pages/Watchhistory/Watchhistory"
import Watchlater from "./Pages/Watchlater/Watchlater"
import Yourvideo from "./Pages/Yourvideo/Yourvideo"
import AuthGuard from "./Component/AuthGuard/AuthGuard"
import AuthCallback from "./Pages/Auth/AuthCallback"

const Allroutes = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search/:Searchquery" element={<Search />} />
      <Route path="/videopage/:vid" element={<Videopage />} />
      <Route path="/auth-callback" element={<AuthCallback />} />

      {/* Protected routes that require OTP verification */}
      <Route
        path="/Library"
        element={
          <AuthGuard>
            <Library />
          </AuthGuard>
        }
      />
      <Route
        path="/Likedvideo"
        element={
          <AuthGuard>
            <Likedvideo />
          </AuthGuard>
        }
      />
      <Route
        path="/Watchhistory"
        element={
          <AuthGuard>
            <Watchhistory />
          </AuthGuard>
        }
      />
      <Route
        path="/Watchlater"
        element={
          <AuthGuard>
            <Watchlater />
          </AuthGuard>
        }
      />
      <Route
        path="/Yourvideo"
        element={
          <AuthGuard>
            <Yourvideo />
          </AuthGuard>
        }
      />
      <Route
        path="/channel/:cid"
        element={
          <AuthGuard>
            <Channel seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage} />
          </AuthGuard>
        }
      />
    </Routes>
  )
}

export default Allroutes
