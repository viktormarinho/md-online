import create from "zustand";


type State = {
    currentDocText: string
    isSaved: boolean
    currentDocTitle: string
}

type Actions = {
    updateDocText: (newText: string) => void
    setIsSaved: (isSaved: boolean) => void
    setDocTitle: (newTitle: string) => void
}

const initialState: State = {
    currentDocText: '',
    isSaved: true,
    currentDocTitle: ''
}

export const useDocStore = create<State & Actions>((set) => ({
    ...initialState,

    updateDocText: (newText) => set((state) => ({ currentDocText: newText })),
    setIsSaved: (isSaved) => set((state) => ({ isSaved })),
    setDocTitle: (newTitle) => set((state) => ({ currentDocTitle: newTitle })),
}))