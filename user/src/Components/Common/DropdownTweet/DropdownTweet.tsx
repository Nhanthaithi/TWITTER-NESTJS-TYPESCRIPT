import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { Button, DropdownMenu } from "@radix-ui/themes";

import { useTweets } from "../../../Context/TweetContext";
import { useUser } from "../../../Context/UserContext";
import { IDropdownTweetProps, ITweetLocal } from "../../../Types/type";
import {
  checkFollowing,
  createBlockedUser,
  getRelevantTweets,
} from "../../../Utils/commonFunction";
import { fetchTweetById } from "../../../Utils/TweetFunction";
import EditTweetModal from "../../Modal/EditTweetModal/EditTweetModal";
import RemoveTweetModal from "../../Modal/RemoveTweetModal/RemoveTweetModal";

const DropdownTweet: React.FC<IDropdownTweetProps> = (props) => {
  const { tweetAuthorId, tweetId } = props;
  const { user: currentUser } = useUser();
  const { setTweets } = useTweets();
  const isCurrentUserTweet = currentUser?._id === tweetAuthorId;
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOpenRemoveTweetModal, setIsOpenRemoveTweetModal] =
    useState<boolean>(false);
  const [isOpenEditTweetModal, setIsOpenEditTweetModal] =
    useState<boolean>(false);
  const [tweet, setTweet] = useState<ITweetLocal | null>(null);
  const path = useLocation().pathname;

  useEffect(() => {
    const isCheckFollowing = async () => {
      const respone = await checkFollowing(tweetAuthorId);
      setIsFollowing(respone);
    };
    isCheckFollowing();
  }, [currentUser, tweetAuthorId]);

  const handleBlockedUser = async (tweetAuthorId: string) => {
    await createBlockedUser(tweetAuthorId);
    if (path === "/home") {
      const tweetsRelevent = await getRelevantTweets();
      setTweets(tweetsRelevent);
    }
    toast.success("This account is blocked successfully.", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  };

  return (
    <div className="dropdown-tweet">
      <ToastContainer />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">...</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {isCurrentUserTweet ? (
            <>
              <DropdownMenu.Item
                shortcut="⌘ E"
                className="font-bold"
                onClick={async (e) => {
                  e.stopPropagation();
                  setIsOpenEditTweetModal(true);
                  const data = await fetchTweetById(tweetId);
                  setTweet(data);
                }}
              >
                Edit
              </DropdownMenu.Item>
              <DropdownMenu.Item
                shortcut="⌘ ⌫"
                color="red"
                className="font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenRemoveTweetModal(true);
                }}
              >
                Delete
              </DropdownMenu.Item>
            </>
          ) : (
            <>
              {isFollowing ? (
                <DropdownMenu.Item
                  shortcut="⌘ E"
                  color="red"
                  className="font-bold"
                >
                  UnFollow
                </DropdownMenu.Item>
              ) : (
                <DropdownMenu.Item
                  shortcut="⌘ E"
                  color="blue"
                  className="font-bold"
                >
                  Follow
                </DropdownMenu.Item>
              )}{" "}
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlockedUser(tweetAuthorId.toString());
                }}
                shortcut="⌘ ⌫"
                color="red"
                className="font-bold"
              >
                Block this User
              </DropdownMenu.Item>
            </>
          )}

          <DropdownMenu.Item
            shortcut="⌘ ⌫"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/profile/${tweetAuthorId}`;
            }}
            color="violet"
            className="font-bold"
          >
            Go to Profile
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <RemoveTweetModal
        isOpenRemoveTweetModal={isOpenRemoveTweetModal}
        setIsOpenRemoveTweetModal={setIsOpenRemoveTweetModal}
        tweetId={tweetId}
      />
      <EditTweetModal
        isOpenEditTweetModal={isOpenEditTweetModal}
        setIsOpenEditTweetModal={setIsOpenEditTweetModal}
        tweet={tweet}
      />
    </div>
  );
};

export default DropdownTweet;
