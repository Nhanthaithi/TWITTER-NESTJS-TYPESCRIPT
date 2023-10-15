import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";

import { useTweets } from "../../../Context/TweetContext";
import { useUser } from "../../../Context/UserContext";
import { IRemoveTweetModal } from "../../../Types/type";
import { getRelevantTweets } from "../../../Utils/commonFunction";
import {
  deleteTweetById,
  fetchAllTweets,
  fetchTweetsByUserId,
} from "../../../Utils/TweetFunction";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function RemoveTweetModal({
  isOpenRemoveTweetModal,
  setIsOpenRemoveTweetModal,
  tweetId,
}: IRemoveTweetModal) {
  const [open, setOpen] = useState<boolean>(false);
  const { user: userLogin } = useUser();
  const { tweets, setTweets } = useTweets();
  const location = useLocation();

  const handleClose = () => {
    setOpen(false);
    setIsOpenRemoveTweetModal(false);
  };
  useEffect(() => {
    setOpen(isOpenRemoveTweetModal);
  }, [isOpenRemoveTweetModal]);

  const handleDeleteTweet = async () => {
    try {
      await deleteTweetById(tweetId);
      if (location.pathname === "/home") {
        const updatedTweets = await getRelevantTweets();
        setTweets(updatedTweets);
      } else if (location.pathname === `/post-detail/${tweetId}`) {
        window.location.href = `/profile/${userLogin?._id}`;
      } else if (location.pathname === `/profile/${userLogin?._id}`) {
        if (userLogin?._id) {
          const newTweets = await fetchTweetsByUserId(userLogin?._id);
          setTweets(newTweets);
        }
      } else {
        const newTweets = await fetchAllTweets();
        setTweets(newTweets);
      }
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal-title"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="edit-profile-modal-title"
            textAlign="center"
            fontWeight="bold"
          >
            Do you want to remove this tweet?
          </Typography>

          <Box mt={2} display="flex" justifyContent="center">
            <Button
              color="info"
              onClick={handleClose}
              sx={{ textTransform: "capitalize", fontWeight: "bold" }}
              variant="contained"
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ ml: 1, textTransform: "capitalize", fontWeight: "bold" }}
              onClick={handleDeleteTweet}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default RemoveTweetModal;
