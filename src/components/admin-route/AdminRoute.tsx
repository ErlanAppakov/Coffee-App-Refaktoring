import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { updateUser } from "../../store/slices/userSlice";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuth } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.email) {
          dispatch(updateUser(parsedUser));
        } else {
          localStorage.removeItem("currentUser");
        }
      } catch (error) {
        console.error("Error restoring session in AdminRoute:", error);
        localStorage.removeItem("currentUser");
      }
    }
    setTimeout(() => setIsChecking(false), 100);
  }, [dispatch, user]);

  if (isChecking) {
    return null;
  }

  const storedUser = localStorage.getItem("currentUser");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);
  const isAdmin = currentUser && currentUser.role === "admin";

  if (!isAuth && !storedUser) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
};

