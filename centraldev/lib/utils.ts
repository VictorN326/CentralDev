import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const getTimeStamp = (createdAt: Date): string => {

// }

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date().getTime();
  const createdTime = createdAt.getTime();
  const seconds = Math.floor((now - createdTime) / 1000);

  // console.log("Time Difference in Seconds: ", seconds);

  let interval = Math.floor(seconds / 31536000); // Seconds in a year
  if (interval >= 1) {
    return interval + " year" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 2592000); // Seconds in a month
  if (interval >= 1) {
    return interval + " month" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 604800); // Seconds in a week
  if (interval >= 1) {
    return interval + " week" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 86400); // Seconds in a day
  if (interval >= 1) {
    return interval + " day" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 3600); // Seconds in an hour
  if (interval >= 1) {
    return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
  }

  interval = Math.floor(seconds / 60); // Seconds in a minute
  if (interval >= 1) {
    return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
  }

  return seconds + " second" + (seconds > 1 ? "s" : "") + " ago";
};

// console.log(getTimeStamp(new Date("2022-12-01T00:00:00.000Z")));

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

// Example usage
// console.log(formatNumber(1234567)); // Outputs: "1.2M"
// console.log(formatNumber(234567)); // Outputs: "234.6K"
// console.log(formatNumber(567)); // Outputs: "567"
