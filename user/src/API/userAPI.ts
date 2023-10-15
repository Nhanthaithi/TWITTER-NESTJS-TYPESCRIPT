import axiosClient from './axiosConfig';

export type LoginParams = {
    email: string;
    password: string;
};

class UserAPI {
    static login(param: LoginParams) {
        const url = `/api/v1/users/login`;
        return axiosClient.post(url, param);
    }

}

export default UserAPI