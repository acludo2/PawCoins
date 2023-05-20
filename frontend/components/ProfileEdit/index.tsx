import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdBadge, faHandshake, faClock, faImage } from '@fortawesome/free-solid-svg-icons';
import "./index.css";

import { useAuth } from '../../auth';

const Wrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className={`wrapper ${isVisible ? '' : 'hidden'}`}>
      <button className="close-button" onClick={handleClose}>X</button>
      {children}
    </div>
  );
};


const ProfileForm = ({ currentProfile, onUpdate,onFileChange,setProfile }) => {

    const handleInputChange = (event) => {
      console.log("sup",event.target.value)
            setProfile({...currentProfile, [event.target.name]: event.target.value});

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onUpdate({name:currentProfile.name,profilePic:currentProfile.profilePic});
    };
   // console.log("current Profile",currentProfile,c)
    return (
        <form onSubmit={handleSubmit}>
          { currentProfile && currentProfile.name === "pawy" && <h2>Update your profile to receive 100 pawcoins!!</h2>}
        <h2>Edit Profile</h2>
       <label><FontAwesomeIcon icon={faUser} /> Name</label>
       <input
           type="text"
           name="name"
           placeholder={currentProfile && currentProfile.name}
           value={currentProfile?currentProfile.name:""}
           onChange={handleInputChange}
           onClick={(e)=>{setProfile({...currentProfile, name: ""})}}
       />
       <label><FontAwesomeIcon icon={faImage} /> Profile Picture</label>
       <input
           type="file"
           name="profilePic"
           onChange={onFileChange}
       />

       <button type="submit">Update Profile</button>
   </form>
);
};



const App = ({setIsLoading,profile,setModalMsg,setModal}) => {
  const{backendActor,isAuthenticated} = useAuth();
  const [currentProfile,setCurrentProfile] = useState(null);

  const defaultProfile = {
    name: "John Doe",
    badget: false,
    proposalsCompleted: 5,
    profilePic: null
  };

  useEffect(()=>{
    if(profile){
      setCurrentProfile(profile);
    }else{
      setCurrentProfile(defaultProfile)
    }
  },[isAuthenticated,profile])


  const [file, setFile] = useState(null);



  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };



const uploadProfilePic = async () => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let profilePic =  [...uint8Array];
        return profilePic
    }





  const handleProfileUpdate = async (updatedProfile) => {
    try {

      const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB in bytes

      if (file.size < maxSizeInBytes) {
        // File is smaller than 10 MB
        console.log("File is smaller than 10 MB");
      } else {
        // File is larger than or equal to 10 MB
        setModalMsg("the file needs to be smaller then 10 MBs");
        setModal(true);
        console.log("File is larger than or equal to 10 MB");

        return
      }
      // Update the profile on the backend
      setIsLoading(true)
      let pic = await uploadProfilePic();
      const updatedProfileWithBuffer = {
        ...updatedProfile,
        profilePic: pic,
      };
      console.log("profile to update",updatedProfileWithBuffer)
     let callet = await backendActor.updateProfile(updatedProfileWithBuffer);
       console.log("profile update",callet);
      // Update the profile in the state
     // setCurrentProfile(updatedProfile);
     setIsLoading(false)
   window.location.reload()

   //  window.location.reload()
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <Wrapper>
        {  profile && isAuthenticated && <ProfileForm setProfile={setCurrentProfile} currentProfile={currentProfile} onUpdate={handleProfileUpdate} onFileChange={onFileChange} />}
    </Wrapper>
  );
};

export default App;
