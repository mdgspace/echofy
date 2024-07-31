export default function getTimestampFromDate(dateString) {
    const date = new Date(dateString);
    const timestamp = Math.floor(date.getTime() / 1000);
    return timestamp;
  }