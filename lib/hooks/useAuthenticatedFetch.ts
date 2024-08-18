import { useRefreshToken } from "../auth";
import { setTokenToCookie } from "../jwt";
import { API_URL, getCookie } from "../utils";

export const useAuthenticatedFetch = () => {
  const accessToken = getCookie("gd:accessToken");
  const { mutateAsync: refreshToken } = useRefreshToken();

  const fetchWithAuth = async (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> => {
    const fetchWithToken = async (token: string): Promise<Response> => {
      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(`${API_URL}/${endpoint}`, authOptions);

      if (response.status === 401) {
        try {
          const newToken = await refreshToken();
          setTokenToCookie(newToken, "gd:accessToken");
          return fetchWithToken(newToken);
        } catch (error) {
          throw new Error("Failed to refresh token");
        }
      }

      return response;
    };

    if (accessToken) {
      return fetchWithToken(accessToken);
    }

    throw new Error("No access token available");
  };

  return fetchWithAuth;
};
