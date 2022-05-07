import axios, { AxiosRequestConfig } from "axios";

const request = async (options: AxiosRequestConfig): Promise<any> => {
    return axios.request(options);
};

export default request;