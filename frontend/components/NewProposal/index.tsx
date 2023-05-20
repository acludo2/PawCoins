import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./index.css";
import { actorController } from '../../../frontend/utils/canister/actor';
import { useAuth } from '../../auth';
import { MAX_CHUNK_SIZE } from "frontend/utils";




const NewProposalForm = ({ setIsLoading, loading,profile,caller,pawCoins,setModal,setModalMsg,setFileLoader}) => {
  const{backendActor,isAuthenticated} = useAuth();

  const [proposalType, setProposalType] = useState("Text");
  const [description, setDescription] = useState("");
  const [icp, setIcp] = useState(0);
  const [content, setContent] = useState("");

useEffect(()=>{

},[loading])


  const MAX_CHUNK_SIZE_VIDEO = 1024 * 500; // 500kb

  const MAX_CHUNK_SIZE_IMG =  2048 * 2048

const [file, setFile] = useState(null);
let MAX_CHUNK_SIZE


const uploadFileInChunks = async (file) => {
  const maxSizeInBytes = 20 * 1024 * 1024; // 10 MB in bytes

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


  let position=0;
  let proposalId;
  let chunkIndex = 0;
  setIsLoading(true)
  if (proposalType === "Video") {
    MAX_CHUNK_SIZE = MAX_CHUNK_SIZE_VIDEO;
  }else if( proposalType == "Image"){
    MAX_CHUNK_SIZE = MAX_CHUNK_SIZE_IMG;

  }
  const roundedNumber = Math.ceil(file.size/MAX_CHUNK_SIZE);

   while (position < file.size) {
    setFileLoader({
      isOpen:true,
      currentIndex:chunkIndex,
      totalChunks:roundedNumber
    })
      const fileChunk = file.slice(position, position + MAX_CHUNK_SIZE);
      const arrayBuffer = await fileChunk.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);


        let content
        if (proposalType === "Video") {
             content = {"Video":0}
        }else{
            content = {[proposalType]: [...uint8Array]};
        }
        // This is the first chunk, so create a new proposal
        if (position === 0) {
          // This is the first chunk, so create a new proposal
          const proposal = {
            description,
            icp,
            content
          }


          proposalId = await backendActor.addNewProposal(proposal);
          console.log("proposal",Number(proposalId.ok))
          if (proposalType === "Video") {

            console.log("Uploading video",chunkIndex,[...uint8Array])
            await backendActor.addProposalVideoChunk(Number(proposalId.ok), [...uint8Array], chunkIndex);
            chunkIndex=chunkIndex+1;
            console.log("what that in incrementing?",chunkIndex)

      }
        } else {
        // This is not the first chunk, so add it to the existing proposal
        console.log("what that heck?",proposalType)
        if (proposalType === "Video") {

                console.log("Uploading video",chunkIndex,[...uint8Array])
                await backendActor.addProposalVideoChunk(Number(proposalId.ok), [...uint8Array], chunkIndex);
                chunkIndex=chunkIndex+1;

          }
        }
        if (proposalType !== "Video") {
          console.log("adding proposal chunk",)
            await backendActor.addProposalChunk(Number(proposalId.ok), [...uint8Array]);
            chunkIndex=chunkIndex+1;
          }

      console.log("next position?", MAX_CHUNK_SIZE,chunkIndex);
      position += MAX_CHUNK_SIZE;

  };
  setFileLoader({
    isOpen:false,
    currentIndex:0,
    totalChunks:0
  })
  setIsLoading(false)

};





const onFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);
};

const onSubmit = () => {
    console.log("file",file);
  if (file) {
    uploadFileInChunks(file);
  } else {
    // Handle the case when text is submitted
  }
};






    if(profile && caller =="2vxsx-fae" || pawCoins<100){
       return null
    }



  return (
    <div className="NewProposalCard" >
      <h2>Create a New Proposal</h2>
      <label>
        Description:
        <input type="text" name="description" placeholder="Enter description" onChange={e => setDescription(e.target.value)} />
      </label>
      <label>
        ICP:
        <input type="number" name="icp" min="0" value={icp} onChange={e => setIcp(Number(e.target.value))} />
      </label>
      <label>
        Type:
        <select value={proposalType} onChange={e => setProposalType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="Video">Video</option>
        </select>
      </label>
      {proposalType === "Text" ? (
        <label>
          Text:
          <textarea name="text" value={content} onChange={e => setContent(e.target.value)} />
        </label>
      ) : (
        <label className="file-input">
                Select a file:
        <input
        type="file"
        name="file"
        onChange={e => {onFileChange(e)}}/>
        <span>{proposalType}</span>
        </label>
      )}
      <button onClick={()=>onSubmit()}>Submit</button>
    </div>
  );
};

export default NewProposalForm;
