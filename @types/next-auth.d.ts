// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation
import { DefaultUser } from "next-auth";

declare module "next-auth" {

  interface Session {
    user: {
      id: string;
    } & User;
  }

  interface User extends DefaultUser {
    hasAccess: boolean;
    email: string;
  }

}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    email: string;
    hasAccess: boolean;
  }
}
