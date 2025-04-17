import axios from "axios";
import { leaveChatURLbuildr } from "../url-builder/url-builder";
import { LeaveChatResponse } from "../../interface/interface";

export async function  leaveChat(userID: string): Promise<LeaveChatResponse | undefined> {
  if (userID) {
    try {
      const url = leaveChatURLbuildr(userID);
      const response = await axios.post<LeaveChatResponse>(url, {});

      return response.data; // Assuming the API returns a response with the properties defined in LeaveChatResponse
    } catch (error) {
      console.error("Error in leaving chat:", error);
      return undefined; // Or handle the error as needed
    }
  }
}
