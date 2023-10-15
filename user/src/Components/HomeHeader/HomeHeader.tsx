import "./HomeHeader.css";

// import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import PhotoIcon from "@mui/icons-material/Photo";

import { useUser } from "../../Context/UserContext";
import { HomeHeaderProps } from "../../Types/type";
import { postNewTweet } from "../../Utils/commonFunction";
import LoadingComponent from "../LoadingComponent/isLoading";

interface Emoji {
  native: string;
}

const HomeHeader: React.FC<HomeHeaderProps> = (props) => {
  const { onNewTweet } = props;

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { user: currentUser } = useUser();
  const [isLoadingImage, setIsloadingImage] = useState<boolean>(false);

  const handleToggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: Emoji) => {
    console.log(emoji.native);
    setInputValue((prevValue) => prevValue + " " + emoji.native);
  };

  const emojiPickerRef = React.useRef<HTMLDivElement | null>(null);

  // Hàm này kiểm tra xem click có nằm ngoài bảng emoji không
  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedImages([...selectedImages, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  //POST NEW TWEET
  const handlePostNewTweet = async (event: FormEvent) => {
    event.preventDefault();
    setIsloadingImage(true);
    const data = { content: inputValue, images: selectedImages };
    try {
      const response = await postNewTweet(data);
      if (response.success) {
        setInputValue("");
        setSelectedImages([]);
        onNewTweet();
      }
      setIsloadingImage(false);
    } catch (error) {
      console.log(error);
      setIsloadingImage(false);
    }
  };

  return (
    <div className="main-page-header">
      {isLoadingImage && <LoadingComponent />}
      <h4 className="font-bold text-xl">Home</h4>
      <div className="tweetbox">
        <form className="form-new-tweet" onSubmit={handlePostNewTweet}>
          <div className="form-group">
            <div className="userAlphabet">
              <img src={currentUser?.avatar} alt="avt" className="avt-user" />
            </div>
            <input
              type="text"
              name="input-new-tweet"
              id="input-new-tweet"
              placeholder="Write your tweet today"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <div className="show-images">
            {selectedImages.map((image, index) => (
              <div key={index} className="image-container">
                <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
                <span onClick={() => handleRemoveImage(index)}>X</span>
              </div>
            ))}
          </div>
          <div className="form-bottom">
            <label htmlFor="img-tweet">
              <PhotoIcon />
            </label>
            <input
              type="file"
              multiple
              id="img-tweet"
              name="images"
              onChange={handleImageSelect}
              accept="image/*"
            />
            <label
              htmlFor="emoji-tweet"
              onClick={handleToggleEmojiPicker}
              onBlur={() => setShowEmojiPicker(false)}
            >
              <InsertEmoticonIcon />
            </label>
            <input type="submit" value="TWEET" className="btn-new-tweet" />
          </div>
        </form>
        <div className="emoji-picker-container" ref={emojiPickerRef}>
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
