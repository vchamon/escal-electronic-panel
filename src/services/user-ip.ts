import { GET_USER_IP_URL } from "../config/urls";

export const getUserIp = () => fetch(GET_USER_IP_URL)
  .then((res) => res.json())
  .then((data) => data.ip)
  