import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useWindowSize } from "@uidotdev/usehooks";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";

import "./App.css";

const Home = lazy(() => import("./modules/Home"));
const Layout = lazy(() => import("./components/Common/Layout/Main"));
const Chat = lazy(() => import("./modules/Chat"));
const SignIn = lazy(() => import("./modules/SignIn"));
const SignUp = lazy(() => import("./modules/SignUp"));
const Listing = lazy(() => import("./modules/Listing"));
const Post = lazy(() => import("./modules/Post"));
const Profile = lazy(() => import("./modules/Profile"));
const Users = lazy(() => import("./modules/Users"));
const Wastes = lazy(() => import("./modules/Wastes"));
const DashboardLayout = lazy(() => import("./modules/Dashboard"));
const MobileNotification = lazy(() => import("./modules/Notification/Mobile"));
const FullPageSpinner = lazy(() =>
  import("./components/Common/FullPageSpinner")
);

const ProtectedRoute = ({ children, auth = false }) => {
  const isLoggedIn = localStorage.getItem("user:token") !== null || false;

  if (!isLoggedIn && auth) {
    return <Navigate to={"/users/sign-in"} />;
  } else if (
    isLoggedIn &&
    ["/users/sign-in", "/users/sign-up"].includes(window.location.pathname)
  ) {
    return <Navigate to={"/"} />;
  }

  return children;
};

const queryClient = new QueryClient({
  defaultOptions: {
    staleTime: 60 * 1000,
  },
});

const App = () => {
  const user = JSON.parse(localStorage.getItem("user:detail"));
  const [hideModals, setHideModals] = useState(false);

  const { width } = useWindowSize();

  useEffect(() => {
    if (width > 640) {
      setHideModals(true);
    } else {
      setHideModals(false);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Suspense fallback={<FullPageSpinner />}>
          <Routes>
            <Route
              path="/users/sign-in"
              element={
                <ProtectedRoute>
                  <SignIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/sign-up"
              element={
                <ProtectedRoute>
                  <SignUp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute auth={true}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="listing" element={<Listing />} />
              {!user.organizationType === "Waste Generator" && (
                <Route path="post" element={<Post />} />
              )}
              <Route path="profile/:id" element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="chats" element={<Chat />} />
              <Route path="chats/:id" element={<Chat />} />
              {!hideModals && (
                <Route path="notifications" element={<MobileNotification />} />
              )}
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index path="users" element={<Users />} />
                <Route path="wastes" element={<Wastes />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
