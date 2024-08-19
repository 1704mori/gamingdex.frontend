import Profile from "@/components/Profile";
import { User } from "@/lib/types/user";
import { API_URL } from "@/lib/utils";

export const revalidate = 3600;

export default async function ProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const response = await fetch(`${API_URL}/user/${id}`);
  const userData = await response.json<User>();

  return <Profile user={userData.attributes} />;
}
