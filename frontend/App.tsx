import React, {Dispatch, SetStateAction, useEffect, useState,useRef} from "react"

/*
 * Connect2ic provides essential utilities for IC app development

import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
/*
 * Some examples to get you started
 */




import ProfileCard from './components/ProfileEdit';
import ProposalWall  from "./components/wall";
import ProfileComponent from "./components/ProfileSection";
import NewProposalComponent from "./components/NewProposal";
import Proposal from "./components/Proposal";
import Menu from "./components/Menu";
import "./index.css";

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from "./auth";




import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat } from '@fortawesome/free-solid-svg-icons';
//import { actorController } from "./utils/canister/actor";




const FileLoader = ({ isOpen, currentIndex, totalChunks, className }) => {
  const percent = Math.floor((currentIndex / totalChunks) * 100);

  if (!isOpen) {
    return null;
  }

  const progressStyle = {
    width: `${percent}%`,
    background: 'linear-gradient(135deg, #ff9f43, #ff7b52)',
  };

  return (
    <div className={`file-loader-modal ${className}`}>
      <div className="file-loader-container">
        <h3>your file is being uploaded to icp please hold tight</h3>
        <div className="file-loader-progress">
          <div className="file-loader-progress-bar" style={progressStyle}></div>
        </div>
        <div className="file-loader-progress-text">{percent}%</div>
      </div>
    </div>
  );
};



const Modal = ({ isOpen, message, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div  className="modal-container">
        <div ref={modalRef} className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Modal Title</h2>
            <button className="modal-close" onClick={() => onClose(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="modal-close-icon"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button onClick={() => onClose(false)} className="modal-button">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};









export const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="loader">
        <FontAwesomeIcon icon={faCat} className="cat-icon" size="3x" />
        <FontAwesomeIcon icon={faDog} className="dog-icon" size="3x" />
        <p style={{backgroundColor:"white"}}>{message}</p>
      </div>
    </div>
  );
};




function App({setModal,setModalMsg,setFileLoader}) {
  const [visibility, setVisibility] = useState([true, true, true]);
  const navigate = useNavigate();
  const { isAuthenticated, identity,login,backendActor,logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profile,setProfile] = useState(null);
  const [caller,setCaller] = useState(null);
  const[icpBalance,setBalance] = useState(null);
  const[pawCoin,setPawCoin] = useState(0);



useEffect(()=>{
    if(isAuthenticated){
     // getIsReady()
     setIsLoading(false)
     getIsReady()

    }else{
      console.log("not auth",identity)
       //getIsReady()
       setProfile(null)
       setCaller(null)
       // setIsLoading(false)
    }
},[isAuthenticated,identity])





  const getIsReady = async () =>{
    const caller = await backendActor.caller()
    const profile = await backendActor.getProfile()
    const pawCoins = await backendActor.getPawCoins()
    setCaller(caller)
    setProfile(profile)
    setPawCoin(pawCoins)
  }




  console.log("last caller?",caller)
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <Menu visibility={visibility} toggleVisibility={setVisibility} />
          {  !isAuthenticated  && <button onClick={async ()=>{login()}} >log in</button>}
          {  !isAuthenticated  && isLoading && <button onClick={async ()=>{setIsLoading(false)}} >check the wall out</button>}
          { isAuthenticated  && <button onClick={async ()=>{logout()}} >log out</button>}
          <ProfileComponent  setCaller={setCaller}  icpBalance={icpBalance===null?0:icpBalance} pawCoins={pawCoin} profile={profile} setProfile={setProfile} setIsLoading={setIsLoading} loading={isLoading} />
          {!isLoading &&   <ProfileCard setModal={setModal} setModalMsg={setModalMsg}  profile={profile} setIsLoading={setIsLoading} /> }
          {!isLoading &&   <NewProposalComponent  setModal={setModal} setModalMsg={setModalMsg}  pawCoins={pawCoin} caller={caller} profile={profile} setIsLoading={setIsLoading} loading={isLoading} setFileLoader={setFileLoader} />}
          {!isLoading && <ProposalWall />}
    </div>
  )
}


function AppPage(){
  const[modal,setModal] = useState(false);
  const[modalMsg,setModalMsg] = useState('');
  const[fileloader,setFileLoader] = useState({
    isOpen:false,
    currentIndex:0,
    totalChunks:0
  })

  useEffect(()=>{

  },[modal,fileloader])

  return(
    <>
    <Modal isOpen={modal} message={modalMsg} onClose={setModal}/>
    <FileLoader isOpen={fileloader.isOpen} currentIndex={fileloader.currentIndex} totalChunks={fileloader.totalChunks} className="my-custom-loader" />
    <Router>
    <Routes>
    <Route path="/proposal/:id" element={<Proposal />} />
      <Route path="/" element={<App setModal={setModal} setModalMsg={setModalMsg} setFileLoader={setFileLoader} />}/>
    </Routes>
    </Router>
    </>
  )
}




export default AppPage;