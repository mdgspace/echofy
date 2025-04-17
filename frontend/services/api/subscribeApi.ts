import axios from "axios";
import { subscribeURLbuildr } from "../url-builder/url-builder";

import { SubscribeResponse ,SubscribeParams } from "../../interface/interface";


// Convert the subscribe function to TypeScript
const subscribe = async ({
  email,
  username,
  userId,
  channel,
  timestamp,
}: SubscribeParams): Promise<SubscribeResponse> => {
  const url = subscribeURLbuildr();

  try {
    const response = await axios.post<SubscribeResponse>(
      url,
      {
        email,
        username,
        userId,
        channel,
        timestamp,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Subscription failed");
    }
  } catch (error: any) {
    // Here, we throw a new error with a message from the server if available
    throw new Error(error.response?.data?.message || "An error occurred during subscription");
  }
};

export default subscribe;
