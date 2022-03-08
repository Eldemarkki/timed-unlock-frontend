import { useCookies } from "react-cookie";

export const useIsLoggedIn = () => {
  const [cookies] = useCookies(["timed-unlock-token"]);
  const isLoggedIn = cookies["timed-unlock-token"];

  return !!isLoggedIn;
};