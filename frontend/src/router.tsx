import { Suspense, lazy } from "react";
import { Navigate, RouteObject } from "react-router";
import App from "./App";
import SuspenseLoader from "./components/suspenseLoader";
import AppLayout from "./components/Layout";

const Loader = (Component: any) => (props: any) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Home = Loader(lazy(() => import("./pages/home")));
const SignIn = Loader(lazy(() => import("./pages/signin")));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="home" /> },
      { path: "home", element: <Home /> },
      { path: "signin", element: <SignIn /> },
      { path: "*", element: <Navigate to="home" /> },
    ],
  },
];

export default routes;