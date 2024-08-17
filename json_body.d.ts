interface Body {
  json<T = unknown>(): Promise<{
    attributes: T;
    pagination?: { total: number };
    result: "ok" | "error";
    message?: string;
  }>;
}
