import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { usersAPI } from "../../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  discount: number;
  orders: any[];
  token?: string;
}

interface UserState {
  user: User | null;
  isAuth: boolean;
  error: string | null;
  loading: boolean;
}

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem("currentUser");
    if (!stored) return null;
    const user = JSON.parse(stored);
    if (user && user.id && user.email) {
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error loading user from storage:", error);
    return null;
  }
};

const storedUser = loadUserFromStorage();

const initialState: UserState = {
  user: storedUser,
  isAuth: !!storedUser,
  error: null,
  loading: false,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await usersAPI.login(credentials);
      if (user.token) {
        localStorage.setItem("token", user.token);
      }
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Неверный email или пароль");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await usersAPI.register(userData);
      if (user.token) {
        localStorage.setItem("token", user.token);
      }
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Ошибка при регистрации");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.error = null;
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuth = true;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.error = null;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuth = true;
        state.error = null;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuth = false;
      });
  },
});

export const { logout, clearError, updateUser } = userSlice.actions;
export default userSlice.reducer;
