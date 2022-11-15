import create from "zustand";

interface DocStore {
    currentDocText: string
    updateDocText: (newText: string) => void
    isSaved: boolean
    setIsSaved: (isSaved: boolean) => void
}

export const useDocStore = create<DocStore>((set) => ({
    currentDocText: '',
    updateDocText: (newText: string) => set((state) => ({ currentDocText: newText })),
    isSaved: true,
    setIsSaved: (isSaved: boolean) => set((state) => ({ isSaved }))
}))