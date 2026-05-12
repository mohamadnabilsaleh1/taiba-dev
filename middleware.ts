import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhook",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/ask-ai",
    "/jobs",
    "/admin-login",
    "/dashboard(.*)",
  ],

  ignoredRoutes: ["/api/webhook", "/api/chatgpt", "/api/grok"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
