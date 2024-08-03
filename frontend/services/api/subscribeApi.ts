import axios from "axios";
import { subscribeURLbuildr } from "../url-builder/url-builder";

interface SubscribeResponse {
  code:number;
  message: string;
}

const subscribe = async (
  email: string,
  username: string,
  userId: string,
  channel: string,
  timestamp: number) : Promise<SubscribeResponse>=> {
  const url = subscribeURLbuildr();
  try {
    const response = await axios.post<SubscribeResponse>(
      url,
      {
        email: email,
        username: username,
        userId: userId,
        channel: channel,
        timestamp: timestamp,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error.response?.data;
  }
};
export default subscribe;