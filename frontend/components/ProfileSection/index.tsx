import React, { Dispatch, SetStateAction, useEffect,useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './index.css';

import { actorController } from '../../../frontend/utils/canister/actor';

import { useAuth } from "../../../frontend/utils/auth";

//type setIsLoading={ setIsLoading: Dispatch<SetStateAction<boolean>>; };

interface ComponentProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
  }
import { faDog, faCat } from '@fortawesome/free-solid-svg-icons';

export const Loader = ({ message = "Loading..." }) => {
    return (
      <div className="loader-container">
        <div className="loader">
          <FontAwesomeIcon icon={faCat} className="cat-icon" size="3x" />
          <FontAwesomeIcon icon={faDog} className="dog-icon" size="3x" />
          <p className="loader-message">{message}</p>
        </div>
      </div>
    );
};



function ProfileComponent({ setIsLoading, loading,profile,setProfile,icpBalance,pawCoins,setCaller}) {
    const[ImgSrc,setImgSrc] = useState(null);
    const auth = useAuth();



    useEffect(()=>{
        if(!profile){
            getContent()
            setIsLoading(true);
        }
        console.log("yo",profile)
        if(profile && profile.profilePic){
            let image = new Uint8Array(profile.profilePic[0]);
            let blob = new Blob([image]);
            let reader = new FileReader();
            reader.onload = function(e) {
              setImgSrc(e.target.result);
            }
            reader.readAsDataURL(blob);
        }


    },[profile,ImgSrc])


       function parseIntegerToDecimal(number) {
        const numberString = number.toString();
        const length = numberString.length;

        if (length < 3) {
          return numberString;
        }

        const integerPart = numberString.slice(0, length - 2);
        const decimalPart = numberString.slice(length - 2);
        const decimalRepresentation = `${integerPart}.${decimalPart}`;

        return decimalRepresentation;
      }





    const getContent = async () =>{

      // console.log("getting profile ",profile);
       }

       if(loading){
        return (
          <div className="App">
            {loading && <Loader message={`"Welcome to PawCoins, your pet-helping dApp! You've received 100 PawCoins from our airdrop. Use these to submit a proposal, detailing which pet needs help and how. Upon donating, you'll earn a "Donator" badge, enabling you to submit more proposals. To earn trust, you can also submit proof of completed proposals. Let's help pets together with PawCoins!"`} />}
            {/* Rest of your app here... */}
          </div>
        );
      }
      let placeHolderImg = "https://cdn.midjourney.com/de16692f-bda7-418d-8138-36c1a9632c40/0_2.png";
    return (
        <div className="ProfileCard">
            <img className="profile-pic" src={ImgSrc?ImgSrc:placeHolderImg} alt="Profile" />
            <h1>{profile && profile.name}</h1>
            <h2>{"Balance ICP "+icpBalance}</h2>
            <h3>{"Pawcoins "+pawCoins}</h3>
            <div className="info-row">
                <FontAwesomeIcon className="fa-icon" icon={faUser} />
                <span>{`Proposals Completed: ${profile && profile.proposalsCompleted}`}</span>
            </div>
            <div className="info-row">
                <FontAwesomeIcon className="fa-icon" icon={faCalendar} />
                <span>{`Last Proposal: ${profile && profile.lastProposal ? profile && profile.lastProposal : 'No proposals yet'}`}</span>
            </div>
            <div className="info-row">
                <FontAwesomeIcon className="fa-icon" icon={faCheckCircle} />
                <span>{`Badge: `}</span>
                <span className="badge">{profile && profile.badget ? 'Yes' : 'No'}</span>
            </div>
        </div>
    );
}

export default ProfileComponent;
