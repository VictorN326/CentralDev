import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { Badge } from "lucide-react";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";
import { any } from "zod";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date().getTime();
  const createdTime = createdAt.getTime();
  const seconds = Math.floor((now - createdTime) / 1000);

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

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

//  get javascript date object as a parameter and return a joined date (just a month and year)
export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};
interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    { url: window.location.pathname, query: currentUrl },
    { skipNull: true }
  );
};

interface RemoveUrlParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveUrlParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParams) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};

export function processJobTitle(title: string | undefined | null): string {
  // Check if title is undefined or null
  if (title === undefined || title === null) {
    return "No Job Title";
  }

  // Split the title into words
  const words = title.split(" ");

  // Filter out undefined or null and other unwanted words
  const validWords = words.filter((word) => {
    return (
      word !== undefined &&
      word !== null &&
      word.toLowerCase() !== "undefined" &&
      word.toLowerCase() !== "null"
    );
  });

  // If no valid words are left, return the general title
  if (validWords.length === 0) {
    return "No Job Title";
  }

  // Join the valid words to create the processed title
  const processedTitle = validWords.join(" ");

  return processedTitle;
}
