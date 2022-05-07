import axios, { AxiosRequestConfig } from "axios";

const request = async (options: AxiosRequestConfig): Promise<any> => {
    return axios.request(options).then(res => res);
};

export default request;