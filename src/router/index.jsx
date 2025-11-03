import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { getRouteConfig } from "./route.utils";

// Layout components
import Root from "@/layouts/Root";
import MainLayout from "@/layouts/MainLayout";

// Auth pages - imported directly (no lazy loading for auth)
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";

// Main pages - lazy loaded
const HomePage = lazy(() => import("@/pages/HomePage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("@/pages/OrderConfirmationPage"));
const OrdersPage = lazy(() => import("@/pages/OrdersPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Helper function to create route with proper suspense wrapping
const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  // Get config for this route
  let configPath;
  if (index) {
    configPath = "/";
  } else {
    configPath = path.startsWith('/') ? path : `/${path}`;
  }

  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      // Auth routes (no layout)
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "callback",
        element: <Callback />,
      },
      {
        path: "error",
        element: <ErrorPage />,
      },
      {
        path: "prompt-password/:appId/:emailAddress/:provider",
        element: <PromptPassword />,
      },
      {
        path: "reset-password/:appId/:fields",
        element: <ResetPassword />,
      },
      // Main app routes (with MainLayout)
      {
        path: "/",
        element: <MainLayout />,
        children: [
          createRoute({
            index: true,
            element: <HomePage />,
          }),
          createRoute({
            path: "cart",
            element: <CartPage />,
          }),
          createRoute({
            path: "checkout",
            element: <CheckoutPage />,
          }),
          createRoute({
            path: "order-confirmation/:orderId",
            element: <OrderConfirmationPage />,
          }),
          createRoute({
            path: "orders",
            element: <OrdersPage />,
          }),
        ],
      },
      // 404 catch-all
      createRoute({
        path: "*",
        element: <NotFoundPage />,
      }),
    ],
  },
]);