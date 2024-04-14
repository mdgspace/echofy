import axios from 'axios';
import { leaveChatURLbuildr } from '../url-builder/url-builder';
import { removeSessionUserId } from '../utilities/utilities';

export async function leaveChat(userID) {
    if (userID) {
     try
      { 
        const url = leaveChatURLbuildr(userID);
        const response = await axios.post(url, {});
      }catch (error) {
        // console.error("Error in leaving chat:", error)
      }
  
  
    }
  }
  
  

  