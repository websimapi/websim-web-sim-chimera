import { create } from 'zustand';

export const useStore = create((set) => ({
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),
    isAppLoading: true,
    setIsAppLoading: (loading) => set({ isAppLoading: loading }),
    isLoading: true,
    setIsLoading: (loading) => set({ isLoading: loading }),
    loadingMessage: 'Initializing...',
    setLoadingMessage: (message) => set({ loadingMessage: message }),
    currentMerge: null,
    setCurrentMerge: (merge) => set({ currentMerge: merge }),
}));

