import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDocStore } from "../state/documentState";
import { trpc } from "../utils/trpc"
import { ForbiddenDoc } from "./ForbiddenDoc";
import { NotFound } from "./NotFound";
import { SaveDocButton } from "./SaveDocButton";
import { Spinner } from "./Spinner";

export function Document({ id }: { id: string}){
    const doc = trpc.getOneDoc.useQuery({ id }, { refetchOnWindowFocus: false, retry: false });
    const [text, setText] = useDocStore(state => ([state.currentDocText, state.updateDocText]));
    const gotInitialContent = useRef(false);
    const setIsSaved = useDocStore(state => state.setIsSaved);

    useEffect(() => {
        if (doc.data?.doc.content && !gotInitialContent.current) {
            setText(doc.data.doc.content);
            gotInitialContent.current = true;
        }
    }, [doc])

    if (doc.isLoading) {
        return <div className="w-full h-full flex justify-center items-center"><Spinner /></div>;
    }

    if (doc.isError && doc.error.data?.code === 'NOT_FOUND') {
        return <NotFound />;
    }

    if (doc.isError && doc.error.data?.code === 'FORBIDDEN') {
        return <ForbiddenDoc />;
    }

    return (
        <div className="flex w-full">
            <MarkdownOptionsPanel id={id} doc={doc.data?.doc} />
            <div className="flex h-full p-2 gap-2 w-full">
                <textarea 
                    className="w-full h-[90vh] border shadow-lg p-2 bg-slate-50 overflow-y-scroll focus:outline-none" 
                    value={text}
                    onChange={(e: any) => {
                        setText(e.target.value);
                        setIsSaved(false);
                    }}
                    placeholder="Write your markdown here"
                    ></textarea>
                <ReactMarkdown className="markdown border shadow-lg">
                    {text}
                </ReactMarkdown>
            </div>
        </div>
    )
}

function MarkdownOptionsPanel({ id, doc }: { id: string, doc: any }) {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <div className={isOpen ? 'panelOpen' : 'panelClosed'}>
            <div className={isOpen ? 'pl-1' : 'hidden'}>
                <h2>Document:</h2>
                <h2 className="font-semibold">{doc.title}</h2>

                <SaveDocButton id={id} />
            </div>
            <div 
                onClick={() => setIsOpen(prev => !prev)} 
                className="bg-slate-300 hover:bg-slate-400 w-2 rounded h-full cursor-pointer">
            </div>
        </div>
    )
}