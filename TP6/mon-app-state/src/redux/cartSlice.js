import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'techstore_cart';

// Lit le panier sauvegardé (try/catch : protège si le JSON est corrompu)
const loadItems = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const items = loadItems();

const initialState = {
  items,
  totalCount: items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  discountPercent: 0
};

const recalculateTotals = (state) => {
  state.totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  state.totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...action.payload, quantity: 1 });
      recalculateTotals(state);
    },
    removeItem: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload);
      if (existing) {
        if (existing.quantity > 1) existing.quantity -= 1;
        else state.items = state.items.filter((i) => i.id !== action.payload);
      }
      recalculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalPrice = 0;
      state.discountPercent = 0;
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    },
    applyPromoCode: (state, action) => {
      state.discountPercent = action.payload === 'POLY2027' ? 20 : 0;
    }
  }
});

export const { addItem, removeItem, clearCart, applyPromoCode } = cartSlice.actions;
export default cartSlice.reducer;