import { GET_USER_IP_URL } from "../config/urls";
import { UserVotes } from "../types";

export const getUserIp = (): Promise<string> => fetch(GET_USER_IP_URL)
  .then((res) => res.json())
  .then((data) => data.ip)

export const getPreviousUserVotes = (councilSocialId: string, userIp: string): UserVotes => {
  const userVotes = localStorage.getItem(buildCacheKey(councilSocialId, userIp))

  if (!userVotes) return {}

  return JSON.parse(userVotes) as UserVotes
}

export const postUserVotes = (councilSocialId: string, userIp: string, userVotes: UserVotes) => {
  localStorage.setItem(buildCacheKey(councilSocialId, userIp), JSON.stringify(userVotes))
}

export const clearUserVotes = (councilSocialId: string, userIp: string) => {
  localStorage.removeItem(buildCacheKey(councilSocialId, userIp))
}

const buildCacheKey = (councilSocialId: string, userIp: string) => {
  return `EP_${councilSocialId}_${userIp}_VOTES`
}