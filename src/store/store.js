import { configureStore } from '@reduxjs/toolkit';
import { categoryApiSlice } from '@/redux/categorySlice';
import { productsApiSlice } from '@/redux/productsSlice';
import { highlightProductsApiSlice } from '@/redux/highlightProducts';
import { usersApiSlice } from '@/redux/userSlice';

export const store = configureStore({
  reducer: {
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    [highlightProductsApiSlice.reducerPath]: highlightProductsApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoryApiSlice.middleware).concat(productsApiSlice.middleware).concat(highlightProductsApiSlice.middleware).concat(usersApiSlice.middleware),
});
