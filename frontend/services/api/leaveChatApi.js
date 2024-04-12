import axios from 'axios';
import { leaveChatURLbuildr } from '../url-builder/url-builder';

export async function leaveChat(userID) {
    if (userID) {
     try
      { 
        const url = leaveChatURLbuildr(userID);
        const response = await axios.post(url, {});
        console.log('response', response);
      }catch (error) {
        console.error('Error leaving chat:', error);
      }
  
  
    }
  }
  
  

  