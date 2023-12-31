import { saveCartToCookie } from '@/lib/cookies';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<{ cartItems: CartItem[] }>) => {
      state.items = action.payload.cartItems;
      state.totalQuantity = action.payload.cartItems.reduce(
        (total, item) => total + item.quantity,
        0,
      );
    },
    increment: (state, action: PayloadAction<{ itemId: number }>) => {
      const targetItem = state.items.find((item) => item.id === action.payload.itemId);
      if (targetItem) {
        targetItem.quantity += 1;
        state.totalQuantity += 1;
      } else {
        state.items.push({ id: action.payload.itemId, quantity: 1 });
        state.totalQuantity += 1;
      }
      saveCartToCookie(state.items);
    },
    decrement: (state, action: PayloadAction<{ itemId: number }>) => {
      const targetItem = state.items.find((item) => item.id === action.payload.itemId);
      if (!targetItem) return;
      if (targetItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== action.payload.itemId);
      } else {
        targetItem.quantity -= 1;
      }
      state.totalQuantity -= 1;
      saveCartToCookie(state.items);
    },
  },
});

export const { setCartItems, increment, decrement } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
