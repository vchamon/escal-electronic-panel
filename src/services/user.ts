import { GET_USER_IP_URL } from "../config/urls";
import { UserVote } from "../types";

const USER_VOTE_CACHE_KEY = (socialId: string, userIp: string) =>
  `USER_VOTE_${socialId}_${userIp.replace(/\./g, '_')}`

export const getUserIp = (): Promise<string> => fetch(GET_USER_IP_URL)
  .then((res) => res.json())
  .then((data) => data.ip)

export const getUserVote = (socialId: string, userIp: string): UserVote => {
  console.log(USER_VOTE_CACHE_KEY(socialId, userIp))
  const userVote = localStorage.getItem(USER_VOTE_CACHE_KEY(socialId, userIp))
  console.log(userVote)
  return userVote ? JSON.parse(userVote) : {}
}

export const saveUserVote = (socialId: string, userIp: string, userVote: UserVote) => {
  localStorage.setItem(USER_VOTE_CACHE_KEY(socialId, userIp), JSON.stringify(userVote))
}