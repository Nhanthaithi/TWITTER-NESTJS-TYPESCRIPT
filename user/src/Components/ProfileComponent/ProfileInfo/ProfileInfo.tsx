import "./ProfileInfo.css";

import React, { useEffect, useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useParams } from "react-router-dom";

import BaseAxios from "../../../API/axiosConfig";
import { useFollowers } from "../../../Context/FollowersContext";
import { useUser } from "../../../Context/UserContext";
import { IUser } from "../../../Types/type";
import { fetchUserById } from "../../../Utils/commonFunction";
import EditProfileModal from "../../Modal/EditProfileModal/EditProfileModal";

const ProfileInfo: React.FC = () => {
  const params = useParams();
  const id = params?.id;
  // console.log(id);
  const { user: userLogin } = useUser();
  const [userProfile, setUserProfile] = useState<IUser | null>(null);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentUserFollowings, setCurrentUserFollowings] = useState<IUser[]>(
    []
  );
  const { followers, setFollowers } = useFollowers();

  useEffect(() => {
    if (userLogin?._id === id) {
      setUserProfile(userLogin);
    } else {
      fetchUserById(id).then(setUserProfile);
    }
  }, [id, userLogin]);

  useEffect(() => {
    if (userLogin) {
      BaseAxios.get(`/api/v1/follow/following/${userLogin._id}`).then(
        (response) => {
          setCurrentUserFollowings(response.data);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Kiểm tra nếu userLogin có giá trị và ID trên URL khác với userLogin
    if (userLogin && userLogin._id !== id) {
      // Gửi yêu cầu lên server để kiểm tra xem userLogin có follow user có ID như trên URL không.
      BaseAxios.get(`/api/v1/follow/checkFollow/${id}`).then((response) => {
        // Dựa vào kết quả trả về từ server, set giá trị của setIsFollow
        setIsFollow(response.data.isFollowing);
      });
    }
  }, [userLogin, id]);

  useEffect(() => {
    if (currentUserFollowings.some((followedUser) => followedUser._id === id)) {
      return setIsFollow(true);
    }
    return setIsFollow(false);
  }, [id, userLogin]);
  const handleFollowing = (userToFollow: IUser | null) => {
    if (userToFollow && userLogin) {
      BaseAxios.post("/api/v1/follow/follow-user", {
        userIdToFollow: userToFollow._id,
      }).then(() => {
        // Cập nhật danh sách người theo dõi của người dùng hiện tại
        setCurrentUserFollowings((prevState) => [...prevState, userToFollow]);
        setFollowers([...followers, userLogin]);
      });
    }
    setIsFollow(true);
  };

  const handleUnFollowing = (userToUnfollow: IUser | null) => {
    if (userToUnfollow && userLogin) {
      BaseAxios.delete(`/api/v1/follow/unfollow-user/${userToUnfollow._id}`)
        .then(() => {
          setCurrentUserFollowings((prevState) =>
            prevState.filter((user) => user._id !== userToUnfollow._id)
          );
          setFollowers(followers.filter((user) => user._id !== userLogin._id));
        })
        .catch((error) => {
          console.error("Error unfollowing the user:", error);
        });
    }
    setIsFollow(false);
  };

  useEffect(() => {
    const handleUserFollowed = (event: CustomEvent<string>) => {
      if (event.detail === id) {
        setIsFollow(true);
      }
    };

    window.addEventListener(
      "userFollowed",
      handleUserFollowed as EventListener
    );
    // Cleanup
    return () => {
      window.removeEventListener(
        "userFollowed",
        handleUserFollowed as EventListener
      );
    };
  }, [id]);

  return (
    <div className="profile-info">
      <div className="user-imgs-info">
        <div className="cover-img">
          <img src={userProfile?.cover_photo} alt="cover-page" />
        </div>
        <div className="avt-img">
          <img src={userProfile?.avatar} alt="avt-page" />
        </div>
        {userLogin?._id === id ? (
          <button
            className="text-white bg-blue-500 btn-edit-profile px-2 py-1 rounded-full"
            onClick={() => setIsOpenModal(true)}
          >
            Edit Profile
          </button>
        ) : isFollow ? (
          <button
            className="text-white bg-black px-2 py-1 rounded-full btn-unfollow font-bold"
            onClick={() => handleUnFollowing(userProfile)}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="text-white bg-black px-2 py-1 rounded-full btn-follow font-bold"
            onClick={() => handleFollowing(userProfile)}
          >
            Follow
          </button>
        )}
      </div>
      <div className="user-profile-info px-4">
        <h5 className="fullname mt-2">
          <b>{userProfile?.fullname}</b>
          {userProfile?.verify && userProfile?.verify > 0 ? (
            <VscVerifiedFilled className="text-blue-500 inline" />
          ) : (
            ""
          )}
        </h5>
        <p className="username text-secondary">@{userProfile?.username}</p>
      </div>
      <EditProfileModal
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </div>
  );
};

export default ProfileInfo;
