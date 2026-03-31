import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { updateUser } from "../../store/slices/userSlice";

interface PrivateRouteProps {
  children: ReactNode;
  isAuth: boolean;
}

export const PrivateRoute = ({ children, isAuth }: PrivateRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Проверяем localStorage для восстановления сессии, если пользователь не загружен
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.email) {
          // Восстанавливаем пользователя в Redux store
          dispatch(updateUser(parsedUser));
        } else {
          localStorage.removeItem("currentUser");
        }
      } catch (error) {
        console.error("Error restoring session in PrivateRoute:", error);
        localStorage.removeItem("currentUser");
      }
    }
    // Даем время на обновление состояния
    setTimeout(() => setIsChecking(false), 100);
  }, [dispatch, user]);

  if (isChecking) {
    return null; // Показываем пустой экран во время проверки
  }

  // Проверяем и localStorage, и Redux состояние
  const storedUser = localStorage.getItem("currentUser");
  const hasValidSession = isAuth || (storedUser && user);

  if (!hasValidSession) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

