import "dotenv/config";

export const config = {
  PORT: Number(process.env.PORT || 3000),
  REPO_DRIVER: process.env.REPO_DRIVER || "inmemory", // "inmemory" | "mysql" (nanti)
};
