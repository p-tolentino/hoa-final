import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  status: Status;
  role: UserRole;
  info: PersonalInfo;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
