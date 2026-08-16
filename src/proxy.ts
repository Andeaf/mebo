import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match everything except Next.js internals and static files (paths with a
  // dot), so unprefixed routes like /m1 get their locale rewrite too.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
