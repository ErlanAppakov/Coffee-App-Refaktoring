import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { Header } from "./components/header/Header";
import { Content } from "./components/content/content";
import { Footer } from "./components/footer/footer";
import { AccountPage } from "./pages/account/AccountPage";
import { AdminPage } from "./pages/admin/AdminPage";
import { NotFound } from "./pages/not-found/NotFound";
import { PrivateRoute } from "./components/private-route/privateRoute";
import { AdminRoute } from "./components/admin-route/AdminRoute";
import BannerHero from "./images/hero-banner.png";
import { Modal } from "./components/modal/modal";
import { RootState, AppDispatch } from "./store/store";
import { updateUser } from "./store/slices/userSlice";

function App() {
  const { isAuth, user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const restoreSession = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id && parsedUser.email) {
            dispatch(updateUser(parsedUser));
          } else {
            localStorage.removeItem("currentUser");
          }
        } catch (error) {
          console.error("Error restoring user session:", error);
          localStorage.removeItem("currentUser");
        }
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <div
      className="app"
      style={{
        backgroundImage: `url(${BannerHero})`,
      }}
    >
      <Header />

      <Routes>
        <Route path="/*" element={<Content />} />
        <Route
          path="/account"
          element={
            <PrivateRoute isAuth={isAuth}>
              <AccountPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <Modal />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
