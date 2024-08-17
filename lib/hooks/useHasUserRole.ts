import { useAtom } from "jotai";
import { userAtom } from "../stores/user";

export default function useHasUserRole(...roles: string[]) {
  const [user] = useAtom(userAtom);

  if (!user) {
    return false;
  }

  return user.roles.some((role) => roles.includes(role.role.name));
}
