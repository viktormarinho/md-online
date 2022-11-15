import { useDocStore } from "../state/documentState";


export function SavedStatusIndicator() {
    const [isSaved, docTitle] = useDocStore(state => ([state.isSaved, state.currentDocTitle]));

    return (
        <div className="text-center">
            <p className="text-lg font-semibold">{docTitle}</p>
            <p>{isSaved ? 'All changes saved' : 'Press Ctrl + S to save your changes'}</p>
        </div>
    );
}