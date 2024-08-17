const MESSAGES: {
  [code: string]: string;
} = {
  AUTH_0004: "Email or password invalid",
};

export const getErrorMessage = (err: { message: string; error: string }) => {
  return (
    MESSAGES[err?.error] ?? err?.error ?? err?.message ?? "Unknown error"
  );
};
