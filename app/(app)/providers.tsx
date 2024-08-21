"use client";

import { setTokenToCookie } from "@/lib/jwt";
import { userAtom } from "@/lib/stores/user";
import { User } from "@/lib/types/user";
import { API_URL, deleteCookie, getCookie } from "@/lib/utils";
import {
  // QueryClient,
  // QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

// const queryClient = new QueryClient();
//
// function _QueryClientProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }

function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [, setUser] = useAtom(userAtom);

  const { data } = useQuery({
    // enabled: !!getCookie("gd:accessToken"),
    queryKey: ["user"],
    queryFn: async () => {
      let response = await fetch(`${API_URL}/auth/check`, {
        headers: {
          Authorization: `Bearer ${getCookie("gd:accessToken")}`,
        },
      });

      if (response.status === 401) {
        const refreshToken = getCookie("gd:refreshToken");
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });
        const refreshResult = await refreshResponse.json<{
          accessToken: string;
          refreshToken: string;
        }>();

        if (refreshResult.result == "ok") {
          const { result, attributes } = refreshResult;

          if (result != "ok") {
            handleLogout();
            return;
          }

          await setTokenToCookie("gd:accessToken", attributes.accessToken);

          // Retry the /auth/check request with the new token
          response = await fetch(`${API_URL}/auth/check`, {
            headers: {
              Authorization: `Bearer ${attributes.accessToken}`,
            },
          });
        } else {
          handleLogout();
        }
      }

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json<User>();
      setUser(result.attributes);
    },
  });

  const handleLogout = () => {
    deleteCookie("gd:accessToken");
    deleteCookie("gd:refreshToken");
    // router.push("/auth");
  };

  return <>{children}</>;
}

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <_QueryClientProvider>
    <Providers>{children}</Providers>
    // </_QueryClientProvider>
  );
}
