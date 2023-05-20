import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../auth';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendar, faCheckCircle, faUser, faDog, faCat } from '@fortawesome/free-solid-svg-icons';
import { FaUser } from 'react-icons/fa';
import { BiMessageAdd, BiMessageRounded } from 'react-icons/bi';







import './index.css';


const CommenterProfile = ({ commenter }) => {
    const { backendActor,isAuthenticated } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const profileData = await backendActor.getCommentProfile(commenter);
                console.log("weeeps",profileData)
                if (profileData && profileData.name) {
                    setProfile(profileData);
                   // setProfilePic(profileData.profilePic)
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        }
        if(!profile){
            console.log("about to fetch profile")
            fetchProfile();
        }
    }, []);

    useEffect(() => {
        if (profile && !profilePic) {
            console.log("loading profile pic",profile.profilePic)
            let blob = new Blob(profile.profilePic, { type: 'image/png' });
            let reader = new FileReader();
            reader.onload = function(e) {
                setProfilePic(e.target.result);
            }
            reader.readAsDataURL(blob);
        }
    }, [profile,profilePic]);

    if (!profile) return null;

    return (
        <div className="commenter-profile">
            <div className="profile-icon-container">
                <img src={profilePic} alt={profile.name || "User"} className="profile-icon" />
            </div>
            <div className="commenter-name">
                {profile.name+"  "+commenter.substring(0,5)+"......" || "Anonymous"}
            </div>
        </div>
    );

};

function Comments({ proposalId }) {
    const { backendActor,isAuthenticated } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        async function loadComments() {
            try {
                const fetchedComments = await backendActor.getComments(Number(proposalId));
                setComments(fetchedComments?.ok || []);
            } catch (error) {
                console.error('Failed to load comments:', error);
            }
        }
        loadComments();
    }, [backendActor, proposalId]);

    const handleNewCommentChange = (event) => {
        setNewComment(event.target.value);
    }

    const handleNewCommentSubmit = async (event) => {
        event.preventDefault();
        if (newComment.trim() !== '') {
            try {
                const addedComment = await backendActor.addNewComment(newComment, Number(proposalId));
                if (addedComment?.ok) {
                    setComments(prevComments => [...prevComments, addedComment.ok]);
                    setNewComment('');
                }
            } catch (error) {
                console.error('Failed to add comment:', error);
            }
        }
    }



    return (
        <div className="comments-container">
            {  isAuthenticated?  <form className="comments-form" onSubmit={handleNewCommentSubmit}>
            <input
            value={newComment}
            onChange={handleNewCommentChange}
            className="comment-input"
            placeholder="New comment"
            />
            <button type="submit" className="post-button">
                <BiMessageAdd /><BiMessageRounded />
            </button>
        </form>:null}
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              {comment && comment.commenter && <CommenterProfile commenter={comment.commenter.toString()} />}
              <div className="comment-body">
                <p>{comment.text}</p>
              </div>
              <div className="comment-footer">{comment.timestamp}</div>
            </div>
          ))}
        </div>
      );
}












function LoadingContent({ isLoading, imgSrc }) {
    if (!isLoading) {
      return null;
    }

    return (
      <div className="LoadingContent">
        <img src={"https://media.discordapp.net/attachments/1075054732667797567/1109571893499015208/videoLoader.png"} alt="Loading..." />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

const ProposalPage = () => {
    const { id } = useParams();
    const { backendActor, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [proposal, setProposal] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [content, setContent] = useState(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const fetchProposal = async () => {
        if (id) {
            let fetchedProposal = await backendActor.getProposal(Number(id));
            let caller = await backendActor.getContent(Number(id));
            console.log("proposal",fetchedProposal);
            console.log("content", caller);
            setProposal(fetchedProposal.ok);
            setContent(caller);
        }
    }

    useEffect(() => {
        if(!proposal){
            fetchProposal();
        }
    }, [id,proposal]);

    useEffect(() => {
        if (content) {
            console.log("content",content)
            if ('Image' in content) {
                let image = new Uint8Array(content.Image);
                let blob = new Blob([image], { type: 'image/png' });
                let reader = new FileReader();
                console.log("image blob",blob)
                reader.onload = function(e) {
                    setImgSrc(e.target.result);
                }
                reader.readAsDataURL(blob);
            } else if ('Video' in content && videoUrl === null) {
                console.log("content",Number(content.Video))
                fetchVideoChunks(Number(id),Number(content.Video)).then((blobURL) => {
                    console.log(" blob url",blobURL);
                    // setVideoUrl(blobURL);
                });
            }
        }
    }, [content, videoRef]); // added videoRef

    // Function to fetch video chunks
    const fetchVideoChunks = async (proposalId, totalChunks) => {
        let newChunks = [];
        for(let i = 0; i < totalChunks+1; i++) {
            const chunkData = await backendActor.getVideoChunk(proposalId, i);
            newChunks = [...newChunks,...chunkData]
        }
        const videoData = new Uint8Array(newChunks);
        const blob = new Blob([videoData], { type: 'video/mp4' });
        const myFile =  new File(
            [blob],
            "demo.mp4",
            { type: 'video/mp4' }
        );

        let reader = new FileReader();
        reader.onload = function(e) {
            setVideoUrl(e.target.result);
        }
        reader.readAsDataURL(myFile);
    }

    const renderContent = () => {
        if ('Image' in content && !imgSrc) {
            return <LoadingContent isLoading={true} imgSrc={"../assets/videoLoader.png"} />;
        } else if ('Video' in content && !videoUrl) {
            return <LoadingContent isLoading={true} imgSrc={"../assets/videoLoader.png"} />;
        } else if ('Image' in content) {
            return imgSrc ? <img className="content media-content" src={imgSrc} alt="Content" /> : null;
        } else if ('Video' in content) {
            return videoUrl ? <video className="content media-content" src={videoUrl} controls /> : null;
        }
    }


    if (!proposal) {
        return ( <div className="loader-container">
        <div className="loader">
          <FontAwesomeIcon icon={faCat} className="cat-icon" size="3x" />
          <FontAwesomeIcon icon={faDog} className="dog-icon" size="3x" />
          <p style={{backgroundColor:"white"}}>"Loading proposal"</p>
        </div>
      </div>)
    }

    return (
        <div className="proposal-page">
            <button className="back-button" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
            </button>
            <div className="proposal-card">
                <h1>{proposal.description}</h1>
                {content && renderContent()}
                <div className="card-footer">
                    <div>
                        <FontAwesomeIcon icon={faUser} />
                        <span>{`ICP: ${Number(proposal.icp)}`}</span>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {/*<span>{`Completed: ${Object.keys(proposal.completed).length}`}</span>*/}
                    </div>
                </div>
                <div className="comments-section">
                      <Comments proposalId={proposal.id} />
                 </div>
                </div>
        </div>
    );
};

export default ProposalPage;
