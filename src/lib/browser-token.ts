const KEY = "mbs-browser-token";

export function getBrowserToken(): string {
  if (typeof window === "undefined") return "";
  let token = window.localStorage.getItem(KEY);
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "");
    window.localStorage.setItem(KEY, token);
  }
  return token;
}
