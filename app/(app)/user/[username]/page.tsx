import Profile from "@/components/Profile";

export const revalidate = 3600;

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  // @ts-ignore
  return <Profile user={{} as any} />;
}
