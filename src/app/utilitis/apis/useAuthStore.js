import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(persist(
  (set) => ({
    isLoggedIn: false,
    user: null,
    accessToken: null,   
    tokenExpiry: null,   
    setAuth: (authData) => set({ 
      isLoggedIn: authData.isLoggedIn, 
      user: authData.user,
      accessToken: authData.accessToken, 
      tokenExpiry: authData.tokenExpiry  
    }),
    setAccessToken: (newToken, newExpiry) =>
        set({
          accessToken: newToken,
          tokenExpiry: newExpiry,
        }),
    logout: () => set({ isLoggedIn: false, user: null, accessToken: null, tokenExpiry: null }),
    setPinsData: (data) => set({
      foundPins: data.pinsData
    })
  }),
  { name: 'auth-storage' }
));

export default useAuthStore;