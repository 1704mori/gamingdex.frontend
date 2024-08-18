import { useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import { API_URL, getCookie } from "./utils";
import { setTokenToCookie } from "./jwt";
import { userAtom } from "./stores/user";

export const useRefreshToken = () => {
  const refreshToken = getCookie("gd:refreshToken");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(API_URL + "/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const { attributes } = await response.json<{
        accessToken: string;
        refreshToken: string;
      }>();

      if (!attributes.accessToken) {
        throw new Error("No access token in response");
      }

      setTokenToCookie(attributes.accessToken, "gd:accessToken");
      localStorage.setItem("gd:accessToken", attributes.accessToken);

      return attributes.accessToken;
    },
  });

  return mutation;
};

export const useFetchUser = () => {
  const accessToken = getCookie("gd:accessToken");
  const [, setUser] = useAtom(userAtom);

  const fetchUser = async () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(API_URL + "/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const result = await response.json<any>();
    if (result.result == "error") {
      throw new Error("could not fetch user");
    }
    setUser(result.attributes);
  };

  return fetchUser;
};
