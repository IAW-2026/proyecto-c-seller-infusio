import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/api/seller/products(.*)",
  "/api/seller/product(.*)",
  "/api/seller/purchase_order(.*)",
  "/api/orders/(.*)/payment-confirmed",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jld?|webmanifest|ttf|woff2?|png|jpg|jpeg|gif|svg|ico|avif|webp)).*)",
    "/(api|trpc)(.*)",
  ],
};
