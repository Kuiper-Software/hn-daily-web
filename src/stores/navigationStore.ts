import { create } from 'zustand';

interface NavigationStore {
  currentRoute: string;
  previousRoute: string;
  isMiniPlayerVisible: boolean;
  
  // Actions
  setCurrentRoute: (route: string) => void;
  setMiniPlayerVisible: (visible: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentRoute: '/',
  previousRoute: '/',
  isMiniPlayerVisible: false,

  setCurrentRoute: (currentRoute: string) => {
    const { currentRoute: prevRoute } = get();
    set({
      currentRoute,
      previousRoute: prevRoute,
    });
  },

  setMiniPlayerVisible: (isMiniPlayerVisible: boolean) => {
    set({ isMiniPlayerVisible });
  },
})); 