import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "./firebase";

// Define the shape of a product in the cart
const customStorage = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const store = create(
  persist(
    (set) => ({
      currentUser: null,
      isLoading: true,
      cartProduct: [],
      favoriteProduct: [],

      getUserInfo: async (uid) => {
        if (!uid) return set({ currentUser: null, isLoading: false });

        const docRef = doc(db, "users", uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            set({ currentUser: { id: docSnap.id, ...docSnap.data() }, isLoading: false });
          } else {
            set({ currentUser: null, isLoading: false });
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          set({ currentUser: null, isLoading: false });
        }
      },

      addToCart: (product) =>
        new Promise((resolve) => {
          set((state) => {
            const existingProduct = state.cartProduct.find((p) => p._id === product._id);
            if (existingProduct) {
              return {
                cartProduct: state.cartProduct.map((p) =>
                  p._id === product._id
                    ? { ...p, quantity: (p.quantity || 0) + 1 }
                    : p
                ),
              };
            } else {
              return {
                cartProduct: [...state.cartProduct, { ...product, quantity: 1 }],
              };
            }
          });
          resolve();
        }),

      decreaseQuantity: (productId) => {
        set((state) => ({
          cartProduct: state.cartProduct.map((p) =>
            p._id === productId
              ? { ...p, quantity: Math.max(p.quantity - 1, 1) }
              : p
          ),
        }));
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cartProduct: state.cartProduct.filter((item) => item._id !== productId),
        }));
      },

      resetCart: () => {
        set({ cartProduct: [] });
      },

      addToFavorite: (product) =>
        new Promise((resolve) => {
          set((state) => {
            const isFavorite = state.favoriteProduct.some((item) => item._id === product._id);
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter((item) => item._id !== product._id)
                : [...state.favoriteProduct, product],
            };
          });
          resolve();
        }),

      removeFromFavorite: (productId) => {
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter((item) => item._id !== productId),
        }));
      },

      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "supergear-storage",
      storage: customStorage,
    }
  )
);
