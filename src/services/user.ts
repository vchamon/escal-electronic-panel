import { GET_USER_IP_URL } from "../config/urls";
import { UserVote } from "../types";

const USER_VOTE_CACHE = (userIp: string) => `USER_VOTE_${userIp}`

export const getUserIp = () => fetch(GET_USER_IP_URL)
  .then((res) => res.json())
  .then((data) => data.ip)

export const saveUserVote = (userIp: string, userVote: UserVote) => {
  localStorage.setItem(USER_VOTE_CACHE(userIp), JSON.stringify(userVote))
}