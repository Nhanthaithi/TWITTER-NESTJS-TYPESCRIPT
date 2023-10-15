import { ChangeEvent, useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import { useUser } from "../../../Context/UserContext";
import { IImageProfile, IModal, IValueInputProfile } from "../../../Types/type";
import {
  fetchCurrentUser,
  fetchUpdateUser,
} from "../../../Utils/commonFunction";
import LoadingComponent from "../../LoadingComponent/isLoading";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  zIndex: 1500,
};

const useStyles: any = makeStyles((theme: any) => ({
  customModal: {
    // Đặt giá trị z-index của Modal theo ý muốn
    zIndex: 1500, // Thay đổi giá trị này thành giá trị bạn muốn
  },
}));

function EditModalProfile({ isOpenModal, setIsOpenModal }: IModal) {
  const [open, setOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [userLogin, setUserLogin] = useState<IUser | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: userLogin, setUser } = useUser();
  const [inputValue, setContentInput] = useState<IValueInputProfile>({
    fullname: "",
    username: "",
  });
  const classes = useStyles();
  const [inputFiles, setInputFiles] = useState<{
    avatar?: File;
    cover_photo?: File;
  }>({});

  const [previewImages, setPreviewImages] = useState<IImageProfile>({
    avatar: userLogin?.avatar || "",
    cover_photo: userLogin?.cover_photo || "",
  });

  useEffect(() => {
    fetchCurrentUser().then(setUser);
    setOpen(isOpenModal);
    setContentInput({
      fullname: userLogin?.fullname || "",
      username: userLogin?.username || "",
    });

    setPreviewImages({
      avatar: userLogin?.avatar || "",
      cover_photo: userLogin?.cover_photo || "",
    });
  }, [isOpenModal]);

  const handleClose = () => {
    setOpen(false);
    setIsOpenModal(false);
  };

  // Hàm xử lý sự kiện thay đổi giá trị input
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContentInput({ ...inputValue, [name]: value });
  };

  // Hàm xử lý sự kiện thay đổi giá trị input file (avatar và cover_photo)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (!files) return; // Return early if files is null or undefined

    setInputFiles({ ...inputFiles, [name]: files[0] });

    if (files[0]) {
      setPreviewImages({
        ...previewImages,
        [name]: URL.createObjectURL(files[0]),
      });
    }
  };

  //XỬ LÝ SỰ KIỆN SUBMIT
  const handleEditProfile = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("fullname", inputValue.fullname);
    formData.append("username", inputValue.username);
    if (inputFiles.avatar) {
      formData.append("avatar", inputFiles.avatar);
    }
    if (inputFiles.cover_photo) {
      formData.append("cover_photo", inputFiles.cover_photo);
    }
    try {
      const updatedUser = await fetchUpdateUser(formData);
      setUser(updatedUser); // cập nhật context với dữ liệu người dùng mới
      setIsLoading(false);

      handleClose();
    } catch (error) {
      setIsLoading(false);

      console.error("Error updating user profile:", error);
    }

    handleClose();
  };

  return (
    <div>
      {isLoading && <LoadingComponent />}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-profile-modal-title"
        className={classes.customModal}
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
            variant="h6"
            textAlign={"center"}
            color="red"
          >
            EDIT PROFFILE USER
          </Typography>

          <TextField
            fullWidth
            margin="normal"
            label="Your fullname"
            variant="outlined"
            name="fullname"
            value={inputValue.fullname}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Your Username"
            variant="outlined"
            name="username"
            value={inputValue.username}
            onChange={handleChange}
          />

          <Box component="label" htmlFor="avatarUpload">
            <img
              src={previewImages.avatar}
              alt="Avatar"
              style={{ width: 100, height: 100 }}
              className="my-2"
            />
          </Box>
          <TextField
            type="file"
            hidden
            id="avatarUpload"
            name="avatar"
            onChange={handleFileChange}
          />

          <Box component="label" htmlFor="coverUpload" mt={2}>
            <img
              src={previewImages.cover_photo}
              alt="Cover Photo"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
              className="my-2"
            />
          </Box>
          <TextField
            type="file"
            hidden
            id="coverUpload"
            name="cover_photo"
            onChange={handleFileChange}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button color="error" onClick={handleClose} sx={{ mr: 1 }}>
              CLOSE
            </Button>
            <Button variant="contained" onClick={handleEditProfile}>
              EDIT
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default EditModalProfile;
