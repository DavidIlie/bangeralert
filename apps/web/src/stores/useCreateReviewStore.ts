import create from "zustand";

type Store = {
  hasReview: boolean;
  setHasReview: (s: boolean) => void;
  selfReview: number;
  setSelfReview: (s: number) => void;
  ogReview: number;
  setOgReview: (s: number) => void;
  reset: () => void;
};

export const useCreateReviewStore = create<Store>((set) => ({
  hasReview: true,
  setHasReview(val: boolean) {
    set((state) => ({
      ...state,
      hasReview: val,
    }));
  },
  selfReview: 0,
  setSelfReview(val: number) {
    set((state) => ({
      ...state,
      selfReview: val,
    }));
  },
  ogReview: 0,
  setOgReview(val: number) {
    set((state) => ({
      ...state,
      ogReview: val,
    }));
  },
  reset() {
    set(() => ({ hasReview: true, selfReview: 0, ogReview: 0 }));
  },
}));
