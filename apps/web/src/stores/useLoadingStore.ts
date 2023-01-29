import create from "zustand";

type Store = {
  loading: boolean;
  toggleLoading: () => void;
};

export const useLoadingStore = create<Store>((set) => ({
  loading: false,
  toggleLoading() {
    set((state) => ({
      ...state,
      loading: !state.loading,
    }));
  },
}));
