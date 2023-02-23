import { Session } from "@acme/auth/backend";
import { useSession } from "next-auth/expo";

const useLoggedInSession = () => {
  const { data } = useSession();
  return { data: data as Session };
};

export default useLoggedInSession;
