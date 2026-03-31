import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  price: number;
  weight: string;
  quantity: number;
  discount?: boolean;
  category?: string;
}

interface CartState {
  items: CartItem[];
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Ошибка сохранения корзины:", error);
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.weight === action.payload.weight
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<{ id: string | number; weight: string }>) => {
      state.items = state.items.filter(
        (item) =>
          !(item.id === action.payload.id && item.weight === action.payload.weight)
      );
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string | number; weight: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.id === action.payload.id && item.weight === action.payload.weight
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.weight === action.payload.weight)
          );
        } else {
          item.quantity = action.payload.quantity;
        }
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

