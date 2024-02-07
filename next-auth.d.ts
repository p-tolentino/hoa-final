import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  info: PersonalInfo;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
