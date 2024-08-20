interface Body {
  json<T = unknown, E = any>(): Promise<{
    attributes: T;
    pagination?: E & { total: number };
    result: "ok" | "error";
    message?: string;
  }>;
}
