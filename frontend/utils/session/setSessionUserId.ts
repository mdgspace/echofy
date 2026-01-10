export default function setSessionUserId(userId: string): void {
    console.log("setSessionUserId called with:", userId);
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userID', userId);
      console.log("userId stored in sessionStorage");
      
      const stored = sessionStorage.getItem('userID');
      console.log("Verification - stored userId:", stored);
    } else {
      console.error("Window is undefined - cannot set userId");
    }
  }