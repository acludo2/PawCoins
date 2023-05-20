import React, { ChangeEvent, useEffect, useRef, useState } from "react";
//import { useHistory } from "react-router-dom";
//import { ProfileInfoPlus } from "../utils/canister/typings";
import { useUploadVideo } from "../utils";
//import { LoadingIndicator } from "./LoadingIndicator";
import "../css/Upload.scss";

/*
 * Allows selection of a file followed by the option to add a caption before
 * uploading to the canister. Utility functions assist in the data translation.
 */
export function Upload({
  wallet
}) {
  //const history = useHistory();
  const [videoFile, setVideoFile] = useState<File>();
  const [videoPreviewURL, setVideoPreviewURL] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadingClean, setUploadingClean] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const videoUploadController = useUploadVideo({
    userId: wallet?.principal || "",
  });

  useEffect(() => {
    inputRef.current?.click();
  }, []);

  useEffect(() => {
    if (uploading && uploadingClean) {
      setUploadingClean(false);
    }
  }, [uploading]);

  useEffect(() => {
    if (videoFile) {
      // Create video preview so the user can see what they've selected
      videoFile.arrayBuffer().then((buffer) => {
        const videoBlob = new Blob([buffer], {
          type: "video/mp4",
        });
        const vidURL = URL.createObjectURL(videoBlob);
        setVideoPreviewURL(vidURL);
      });
    }
  }, [videoFile]);

  function onChange(evt: ChangeEvent<HTMLInputElement>) {
    const { files } = evt.target;
    if (files && files.length === 1 && files.item(0)) {
      const file = files[0];
      setVideoFile(file);
    }
  }

  // Wraps and triggers several functions in the videoUploadController to
  // generate a videoId and begin uploading.
  function upload() {
    if (!videoFile) {
      return;
    }
    videoUploadController.setFile(videoFile);
    videoUploadController.setReady(true);
    setUploading(true);
  }

  // On upload success, wait 2 seconds and then redirect to /feed
  useEffect(() => {
    if (videoUploadController.completedVideo !== undefined) {
      setUploading(false);
    }
  }, [videoUploadController.completedVideo]);

  return (
    <main
      id="video-upload-container"
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <input
        id="video-upload"
        type="file"
        ref={inputRef}
        accept=".mp4"
        onChange={onChange}
      />
      {videoFile && (
        <div className="video-add-details">
          <video src={videoPreviewURL} muted autoPlay loop />
          <button className="medium primary" onClick={upload}>
              Post
            </button>
       {/* <div className="details-entry">
            <textarea
              className="caption-content"
              ref={textAreaRef}
              placeholder="Add caption"
              rows={6}
            />

          </div>*/}
        </div>
      )}
    </main>
  );
}
