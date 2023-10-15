import React, { ChangeEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';

import { useTweets } from '../../../Context/TweetContext';
import { useUser } from '../../../Context/UserContext';
import { IEditTweetModal, IValueInputEditTweetContent } from '../../../Types/type';
import { getRelevantTweets } from '../../../Utils/commonFunction';
import { fetchAllTweets, fetchTweetsByUserId, updateTweetById } from '../../../Utils/TweetFunction';

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "1px solid",
  boxShadow: 24,
  p: 4,
};

function EditTweetModal({
  isOpenEditTweetModal,
  setIsOpenEditTweetModal,
  tweet,
}: IEditTweetModal) {
  const [open, setOpen] = useState<boolean>(false);
  const location = useLocation();
  const { user: userLogin } = useUser();

  const { setTweets } = useTweets();
  const [inputValue, setContentInput] = useState<IValueInputEditTweetContent>({
    content: tweet?.content,
  });

  const [inputFiles, setInputFiles] = useState<{ medias?: File[] }>({
    medias: [],
  });

  const [previewImages, setPreviewImages] = useState<string[]>(
    tweet?.medias ?? []
  );

  useEffect(() => {
    setOpen(isOpenEditTweetModal);
    setContentInput({
      content: tweet?.content || "",
    });

    setPreviewImages(tweet?.medias ?? []);
  }, [isOpenEditTweetModal, tweet]);

  const handleClose = () => {
    setOpen(false);
    setIsOpenEditTweetModal(false);
  };

  // Hàm xử lý sự kiện thay đổi giá trị input
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContentInput({ ...inputValue, [name]: value });
  };

  //Xử lý ảnh
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files) return;

    // Cập nhật state cho files

    // Tạo URL tạm thời cho mỗi file và cập nhật vào state
    const previewURLs = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(previewURLs);
    setInputFiles({ medias: Array.from(files) });
  };

  //XỬ LÝ SỰ KIỆN SUBMIT
  const handleEditTweet = async () => {
    //Phải là newformData
    const formData: { content: string; medias: File[] } = {
      content: "",
      medias: [],
    };
    if (inputValue.content) {
      formData.content = inputValue.content;
    }
    if (inputFiles.medias) {
      formData.medias = inputFiles.medias;
    }
    try {
      if (tweet?._id) {
        await updateTweetById(tweet?._id, formData);
        if (location.pathname === "/home") {
          const newTweets = await getRelevantTweets();
          setTweets(newTweets);
        } else if (location.pathname === `/profile/${userLogin?._id}`) {
          if (userLogin?._id) {
            const newTweets = await fetchTweetsByUserId(userLogin?._id);
            setTweets(newTweets);
          }
        } else {
          const newTweets = await fetchAllTweets();
          setTweets(newTweets);
        }
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }

    handleClose();
  };

  return (
    <div
      onClick={(e) => {
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
            fontWeight="bold"
            textAlign="center"
            color="red"
          >
            EDIT TWEET
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Tweet Content"
            variant="outlined"
            name="content"
            value={inputValue?.content}
            onChange={handleChange}
          />
          <Box component="label" htmlFor="Images">
            {previewImages.length
              ? previewImages.map((image, index) => (
                  <img
                    src={image}
                    alt="Image Tweet"
                    style={{ width: 100, height: 100 }}
                    className="my-2"
                    key={index}
                  />
                ))
              : ""}
          </Box>
          <TextField
            type="file"
            hidden
            id="Images"
            name="medias"
            onChange={handleFileChange}
          />
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
              sx={{ mr: 1, textTransform: "capitalize" }}
            >
              CLOSE
            </Button>
            <Button
              variant="contained"
              onClick={handleEditTweet}
              sx={{ textTransform: "capitalize" }}
            >
              EDIT
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default EditTweetModal;
