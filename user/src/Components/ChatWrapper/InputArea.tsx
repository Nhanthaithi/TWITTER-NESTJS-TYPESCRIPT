// InputArea.tsx
import React, { useState } from "react";
import { BiSend } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { MdInsertPhoto } from "react-icons/md";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const InputArea = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleEmojiSelectChat = (emoji: { native: string }) => {
    setMessage((prevMessage) => prevMessage + emoji.native);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewImage(null);
  };

  return (
    <div className="input-area">
      <label htmlFor="chat-file" className="text-blue-500 text-lg me-2">
        <MdInsertPhoto />
        <input type="file" id="chat-file" hidden onChange={handleFileChange} />
      </label>

      <label htmlFor="chat-emoji" className="text-blue-500 text-lg">
        <BsEmojiSmile onClick={() => setShowEmojiPicker((prev) => !prev)} />
      </label>
      <div className="input-with-image">
        {previewImage && (
          <div className="image-preview">
            <img src={previewImage} alt="chosen" className="input-image" />
            <button onClick={handleRemoveImage}>X</button>
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <button className="send-mess-btn text-blue-500 text-xl">
        <BiSend />
      </button>
      <div className="emoji-picker-container-chat">
        {showEmojiPicker && (
          <div className="emoji-picker">
            <Picker data={data} onEmojiSelect={handleEmojiSelectChat} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputArea;
