import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useDocStore } from "../state/documentState";
import { DocType } from "../utils/DocType";
import { trpc } from "../utils/trpc"
import { AllowedUsersList } from "./AllowedUsersList";
import { ForbiddenDoc } from "./ForbiddenDoc";
import { Link } from "./Link";
import { NotFound } from "./NotFound";
import { SaveDocButton } from "./SaveDocButton";
import { Spinner } from "./Spinner";


export function Document({ id }: { id: string}){
    const doc = trpc.getOneDoc.useQuery({ id }, { refetchOnWindowFocus: false, cacheTime: 0, retry: (failureCount, error) => {
        if (error.data?.code === 'UNAUTHORIZED') return false;
        if (error.data?.code === 'NOT_FOUND') return false;
        return true;
    }});
    const { text, setIsSaved, setText, setDocTitle } = useDocStore(state => ({
        text: state.currentDocText, 
        setIsSaved: state.setIsSaved,
        setText: state.updateDocText,
        setDocTitle: state.setDocTitle
    }));
    const gotInitialData = useRef(false);

    useEffect(() => {
        if (doc.isSuccess && !gotInitialData.current) {
            gotInitialData.current = true;
            setText(doc.data.doc.content);
            setDocTitle(doc.data.doc.title);
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
            <MarkdownOptionsPanel id={id} doc={doc.data?.doc!} />
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

function MarkdownOptionsPanel({ id, doc }: { id: string, doc: DocType }) {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <div className={isOpen ? 'panelOpen' : 'panelClosed'}>
            <div className={isOpen ? 'px-1' : 'hidden'}>
                <h2 className="text-lg text-center mb-4">Document options</h2>
                <p className="text-center">Owner: <br /> {doc.user.username}</p>
                <SaveDocButton id={id} />
                <Link 
                to={"/presentation/" + id}
                className="text-center block mt-2 rounded-lg shadow-lg text-white bg-blue-500 w-full border py-1 px-2 disabled:opacity-40">
                    Presentation mode
                </Link>
                <AllowedUsersList doc={doc} />
            </div>
            <div 
                onClick={() => setIsOpen(prev => !prev)} 
                className="bg-slate-300 hover:bg-slate-400 w-2 rounded h-full cursor-pointer">
            </div>
        </div>
    )
}