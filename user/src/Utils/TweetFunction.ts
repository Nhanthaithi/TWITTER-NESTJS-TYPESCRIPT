//GET TWEET BY TWEET ID
import BaseAxios from '../API/axiosConfig';

export const fetchTweetById = async (idTweet: string) => {
    try {
        const response = await BaseAxios.get(`/api/v1/tweets/${idTweet}`)
        return response.data.tweet
    } catch (err) {
        console.log(err);

    }
};

//GET ALL TWEETS 
export const fetchAllTweets = async () => {
    try {
        const response = await BaseAxios.get(`/api/v1/tweets/alltweets`)
        return response.data.tweets
    } catch (err) {
        console.log(err);
    }
};

//DELETE TWEET BY TWEET ID
export const deleteTweetById = async (idTweet: string) => {
    try {
        const response = await BaseAxios.delete(`/api/v1/tweets/${idTweet}`)
        return response.data; // Trả về dữ liệu kết quả từ API
    } catch (err) {
        console.error("Error deleting tweet:", err); // Sử dụng console.error thay vì console.log để log lỗi
        throw err; // Throw lỗi ra ngoài để có thể xử lý tại nơi gọi hàm này (nếu cần)
    }
};

// GET TWEETS BY USER ID
export const fetchTweetsByUserId = async (userId: string) => {
    try {
        const response = await BaseAxios.get(`/api/v1/tweets/user/${userId}`)
        if (response?.data?.tweets) { return response?.data?.tweets }// Giả định rằng API trả về dữ liệu với key là "tweets"
    } catch (err) {
        console.error("Error fetching tweets by user ID:", err);
        throw err;
    }
};

//UPDATE TWEET BY TWEET ID
type TweetUpdateData = {
    content?: string;
    medias?: File[];
};
export const updateTweetById = async (idTweet: string, formData: TweetUpdateData) => {
    try {
        const response = await BaseAxios.patch(`/api/v1/tweets/${idTweet}`, formData)
        return response.data.tweet; // Giả định rằng API trả về dữ liệu cập nhật với key là "tweet"
    } catch (err) {
        console.error("Error updating tweet:", err);
        throw err; // Throw lỗi ra ngoài để có thể xử lý tại nơi gọi hàm này (nếu cần)
    }
};

// LIKE TWEET BY ID
export const likeTweetById = async (idTweet: string) => {
    try {
        const response = await BaseAxios.post(`/api/v1/tweets/${idTweet}/like`);
        return response.data; // Giả định rằng API trả về dữ liệu sau khi thực hiện like
    } catch (err) {
        console.error("Error liking tweet:", err);
        throw err;
    }
};

// UNLIKE TWEET BY ID
export const unlikeTweetById = async (idTweet: string) => {
    try {
        const response = await BaseAxios.post(`/api/v1/tweets/${idTweet}/unlike`);
        return response.data; // Giả định rằng API trả về dữ liệu sau khi thực hiện unlike
    } catch (err) {
        console.error("Error unliking tweet:", err);
        throw err;
    }
};

// GET USERS WHO LIKED A TWEET BY TWEET ID
export const fetchUsersWhoLikedTweet = async (idTweet: string) => {
    try {
        const response = await BaseAxios.get(`/api/v1/tweets/${idTweet}/likes`);
        return response.data.users; // Giả định rằng API trả về danh sách người dùng với key là "users"
    } catch (err) {
        console.error("Error fetching users who liked the tweet:", err);
        throw err;
    }
};

//TẠO COMMENT
export const createComment = async (tweetId: string, content: string, images: File[]) => {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('parentId', tweetId);
    images.forEach(image => formData.append('images', image));

    try {
        const response = await BaseAxios.post(`/api/v1/tweets/comments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.newComment;
    } catch (err) {
        console.error("Error creating comment:", err);
        throw err;
    }
};

// GET COMMENTS BY PARENT ID (i.e., the original tweet's ID)
export const fetchCommentsByParentId = async (parentId: string) => {
    try {
        const response = await BaseAxios.get(`/api/v1/tweets/comments/get-comment/${parentId}`);
        return response.data.comments; // Giả định rằng API trả về danh sách bình luận với key là "comments"
    } catch (err) {
        console.error("Error fetching comments by parent ID:", err);
        throw err;
    }
};