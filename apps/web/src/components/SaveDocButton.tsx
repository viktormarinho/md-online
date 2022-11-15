import { useCallback, useEffect } from "react";
import { useDocStore } from "../state/documentState";
import { trpc } from "../utils/trpc";


export function SaveDocButton({ id }: { id: string }) {
    const text = useDocStore(state => state.currentDocText);
    const [isSaved, setIsSaved] = useDocStore(state => ([state.isSaved, state.setIsSaved]));
    const saveDocMutation = trpc.updateDoc.useMutation({
        onSuccess: ({ doc }) => {
            setIsSaved(doc.content === text);
        }
    })

    const saveDoc = useCallback(() => {
        saveDocMutation.mutate({
            id,
            newContent: text
        })
    }, [id, saveDocMutation, text])
    
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key == 's' && !event.repeat) {
                event.preventDefault();
                event.stopPropagation();
                saveDoc();
            }
        }
        
        document.addEventListener('keydown', handleKeyPress);
        
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [saveDoc])

    return (
        <>
        <button
            onClick={saveDoc}
            disabled={isSaved} 
            className="mt-2 rounded-lg shadow-lg text-white bg-blue-500 w-full border py-1 px-2 disabled:opacity-40"
            title="Press save or Ctrl + S"
        >
            {isSaved ? 'All changes saved' : 'Save'}
        </button>
        </>
    )
}