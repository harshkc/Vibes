import "./styles/index.css";
import "./styles/audioControl.css";
import React, {useState} from "react";
import AdditionSettings from "./components/AdditionalSettings";
import triangle from "./images/playBtn.png";
import play from "./images/playBtn.png";
import pauseImg from "./images/pause.png";
import volumeOn from "./images/volumeOn.png";
import loopImg from "./images/loop.png";
import mute from "./images/mute.png";
import {motion} from "framer-motion";
import ReactPlayer from "react-player";
import LoginForm from "./components/LoginForm/LoginForm";
import {useAuth} from "./context/AuthProvider";
import {auth, db} from "./firebase";
import {signOut} from "firebase/auth";
import {getDocs, collection, deleteDoc, doc} from "firebase/firestore";
import {defaultStations} from "./utils/defaultStations";
import {AiOutlinePlus, AiFillDelete} from "react-icons/ai";
import extractVideoId from "./utils/extractVideoId";
import VibeForm from "./components/VibeForm/VibeForm";
import Session from "./components/Pomodoro/Session";
import TodoList from "./components/Todo/TodoList";
import SongName from "./components/SongName";

let lastPlayedVolume = 0;

function App() {
  const {user, setUser} = useAuth();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoop, setLoop] = useState(false);
  const [volume, setVolume] = useState(1);

  const [theStations, setTheStations] = useState(defaultStations);
  const [adminStations, setAdminStations] = useState([]);
  const [video, setVideo] = useState(`//www.youtube.com/embed/TURbeWK2wwg?autoplay=1&mute=1&start=1`);
  const [streamingLink, setStreamingLink] = useState({
    link: "https://www.youtube.com/watch?v=5qap5aO4i9A&ab_channel=LofiGirl",
    name: "LofiGirl",
  });
  const [showModal, setShowModal] = useState(false);

  const getStations = async () => {
    try {
      const userStationsSnapshot = await getDocs(collection(db, "users", user.id, "user_stations"));
      const adminStationsSnapshot = await getDocs(collection(db, "admin_stations"));
      const userStations = userStationsSnapshot?.docs?.map((doc) => doc.data());
      const adminStations = adminStationsSnapshot?.docs?.map((doc) => doc.data());
      setAdminStations(adminStations);
      setTheStations([...userStations, ...adminStations]);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (user !== null) {
      getStations();
    }
  }, []);

  const addAStation = (newStation) => {
    setTheStations((prevStations) => [newStation, ...prevStations]);
  };

  const deleteStationFromDB = async (videoId) => {
    try {
      const toDeleteRef = doc(db, "users", user.id, "user_stations", videoId);
      await deleteDoc(toDeleteRef);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteStation = (station) => {
    const index = adminStations.findIndex((sta) => sta.link === station.link);
    if (index !== -1) {
      alert("Can't delete default stations");
      return;
    }
    const videoId = extractVideoId(station.link);
    deleteStationFromDB(videoId);
    if (station.link === streamingLink.link) handleEnd();
    const updatedStations = theStations.filter((sta) => sta.link !== station.link);
    setTheStations(updatedStations);
  };

  const handleLoginClick = () => {
    setIsShowLogin((isShowLogin) => !isShowLogin);
  };

  const setMusicState = (link, name) => {
    const videoId = extractVideoId(link);
    setVideo(`//www.youtube.com/embed/${videoId}?autoplay=1&mute=1&start=1`);
    setStreamingLink({link, name});
    setIsStreaming(true);
  };

  const handleEnd = () => {
    //find the index of object from theStations array which matches stationName
    const index = theStations.findIndex((station) => station.link === streamingLink.link);
    if (index === -1) return;
    setMusicState(theStations[index + 1].link, theStations[index + 1].name);
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("BoostUser");
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVibeCheck = () => {
    if (!user) setIsShowLogin(true);
    else setShowModal((prev) => !prev);
  };

  return (
    <div className='interfaceContainer'>
      <div className='radioContainer'>
        <div className='logo'>Vibes</div>
        {user ? (
          <span onClick={logout} className='loginicon'>
            Logout
          </span>
        ) : (
          <span onClick={handleLoginClick} className='loginicon'>
            Login
          </span>
        )}

        <div className='radioStationsContainer'>
          <div className='radioList'>
            <motion.div
              whileHover={{scale: 1.09}}
              whileTap={{scale: 0.9}}
              onClick={handleVibeCheck}
              className='station'
              style={{
                margin: "0.5rem 0.2rem",
                padding: "0.2rem",
                border: "1px solid white",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
              }}
            >
              <AiOutlinePlus />
              <span style={{fontSize: "14px"}}>Add yours</span>
            </motion.div>

            {theStations.map((station) => {
              return (
                <>
                  <motion.div
                    key={station.name}
                    whileHover={{scale: 1.09}}
                    whileTap={{scale: 0.9}}
                    className='station'
                    style={{textAlign: "left"}}
                  >
                    <span
                      style={{float: "left", width: "80%"}}
                      onClick={() => setMusicState(station.link, station.name)}
                    >
                      <img className='triangle' src={triangle} alt='' />
                      {station.name}
                    </span>
                    {user && (
                      <span onClick={() => deleteStation(station)} style={{float: "right", width: "20%"}}>
                        <AiFillDelete />
                      </span>
                    )}
                  </motion.div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{position: "absolute", right: "3rem", top: "5rem", zIndex: "1"}}>
        <Session />
      </div>
      <div style={{position: "absolute", right: "2rem", top: "40%", zIndex: "1"}}>
        <div className='todo-app'>
          <TodoList />
        </div>
      </div>
      <div style={{position: "absolute", right: "60%", top: "70%"}}>
        <SongName radio={streamingLink.name} link={streamingLink.link} />
      </div>
      <div className='audioControlContainer'>
        {user && (
          <VibeForm
            showModal={showModal}
            setShowModal={setShowModal}
            addAStation={addAStation}
            theStations={theStations}
          />
        )}
        {!user && <LoginForm isShowLogin={isShowLogin} setShowLogin={setIsShowLogin} />}
        <div className='audioControl'>
          <motion.div
            whileHover={{scale: 1.09}}
            whileTap={{scale: 0.9}}
            className='volumeOn'
            style={{border: isLoop ? "1px solid white" : "1px solid red"}}
            onClick={() => setLoop(!isLoop)}
          >
            <img className='audioOnImg' src={loopImg} alt='loop' />
          </motion.div>
          <motion.div
            whileHover={{scale: 1.03}}
            whileTap={{scale: 0.9}}
            onClick={() => {
              setIsStreaming((prevState) => !prevState);
            }}
            className='playPause'
          >
            {isStreaming ? (
              <img className='playBtn2' src={pauseImg} alt='pause' />
            ) : (
              <img className='playBtn' src={play} alt='play' />
            )}
          </motion.div>
          <motion.div
            whileHover={{scale: 1.09}}
            whileTap={{scale: 0.9}}
            className='volumeOn'
            onClick={() => {
              if (!volume) {
                setVolume(lastPlayedVolume);
              } else {
                lastPlayedVolume = volume;
                setVolume(0);
              }
            }}
          >
            {!volume ? (
              <img className='audioOffImg' src={mute} alt='volume' />
            ) : (
              <img className='audioOnImg' src={volumeOn} alt='mute' />
            )}
          </motion.div>
          <div>
            <input
              className='volumeDial'
              type='range'
              min={0}
              max={1}
              value={volume}
              step={0.01}
              onChange={(event) => {
                setVolume(event.target.valueAsNumber);
              }}
            />
          </div>
        </div>
      </div>
      <div className={isStreaming ? "unpauseScreen" : "pauseScreen"}>
        <p style={{marginTop: "30rem"}}>Music Paused</p>
      </div>
      <AdditionSettings />
      <div className='videoContainer'>
        <iframe
          className='vid'
          src={video}
          scrolling='no'
          mute='1'
          width='140%'
          height='140%'
          frameBorder='0'
          allow='accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          webkitallowfullscreen=''
          mozallowfullscreen=''
          allowFullScreen=''
        />
      </div>

      <ReactPlayer
        className='liveStreamPlayer'
        playing={isStreaming}
        volume={volume}
        url={streamingLink.link}
        onEnded={handleEnd}
        loop={isLoop}
      />

      <div className='loading'>
        <div className='container'>
          <div className='ring'></div>
          <div className='ring'></div>
          <div className='ring'></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
