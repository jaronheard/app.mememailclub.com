import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/404",
    "/500",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/send",
    "/terms",
    "/api/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
