import "./CommentForm.css";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AiOutlinePicture } from "react-icons/ai"; // For image icon
import { BsFillSendFill } from "react-icons/bs";
import { useLocation, useParams } from "react-router-dom";

import { useTweets } from "../../Context/TweetContext";
// import { useUser } from "../../Context/UserContext";
import { ITweetLocal } from "../../Types/type";
import { getRelevantTweets } from "../../Utils/commonFunction";
import {
  createComment,
  fetchAllTweets,
  fetchTweetsByUserId,
} from "../../Utils/TweetFunction";

const CommentForm: React.FC<{ onBlur: () => void; tweet: ITweetLocal }> = ({
  onBlur,
  tweet,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [contentComment, setContentComment] = useState("");
  const { setTweets } = useTweets();
  // const { user: currentUser } = useUser();
  const { id } = useParams();

  const location = useLocation();

  // useEffect to close comment form
  useEffect(() => {
    const handleDocumentClick = () => {
      onBlur();
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [onBlur]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  //Sự kiện Onchange ô input
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContentComment(e.target.value);
  };

  //Sự kiện POST COMMENT
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await createComment(tweet._id, contentComment, images); // Sử dụng tweet.id từ props
      // Sau khi comment thành công, bạn có thể reset state hoặc thực hiện hành động khác ở đây
      setContentComment("");
      setImages([]);
      if (location.pathname === `/profile/${id}`) {
        const newTweets = await fetchTweetsByUserId(id as string);
        setTweets(newTweets);
        return;
      } else if (location.pathname === `/home`) {
        const newTweets = await getRelevantTweets();
        setTweets(newTweets);
        return;
      }
      const newTweets = await fetchAllTweets();
      setTweets(newTweets);
      // Nếu bạn muốn render lại comment ngay lập tức, bạn có thể thêm nó vào một state chứa các comments (chưa được thể hiện trong code của bạn)
    } catch (error) {
      console.log("Error creating comment. Please try again.");
    }
  };

  //Render ngay khi comment xong
  // Lấy comment theo IDtweet

  const handleClick = (event: FormEvent) => {
    event.stopPropagation();
    // code to handle click event
  }; //stop event propagation

  return (
    <form
      className="comment-form border border-blue-500 rounded p-2"
      onSubmit={handleSubmit}
      onClick={handleClick}
    >
      <div className="comment-form__images">
        {images.map((image, index) => (
          <div key={index} className="comment-form__image">
            <img src={URL.createObjectURL(image)} alt="Preview" />
            <button
              onClick={() => handleImageRemove(index)}
              className="remove-image-comment-button"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <textarea
        placeholder="Write your comment..."
        name="content"
        onChange={handleInputChange}
        value={contentComment}
      ></textarea>
      <label className="img-comment text-blue-500">
        <AiOutlinePicture size={20} />
        <input
          type="file"
          onChange={handleImageChange}
          multiple
          accept="image/*"
          hidden
          name="images"
        />
      </label>
      <button type="submit" className="btn-sendcomment text-blue-500">
        <BsFillSendFill />
      </button>
    </form>
  );
};

export default CommentForm;
