import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { trpc } from "../utils/trpc";
import { Link } from "./Link";
import { Spinner } from "./Spinner";


export function Doclist() {
    const utils = trpc.useContext();
    const myDocs = trpc.getMyDocs.useQuery();
    const deleteDocMutation = trpc.deleteDoc.useMutation({
        onError: (error) => {
            toast(JSON.parse(error.message)[0].message, { type: 'error', position: "top-center" })
        },
        onSuccess: () => {
            utils.getMyDocs.invalidate();
        }
    });

    const deleteDoc = (docId: string, docTitle: string) => {
        const ok = confirm(`Are you sure you want to delete the doc ${docTitle}?`)

        if (ok) {
            deleteDocMutation.mutate({ docId });
        }
    }

    if (myDocs.isLoading) {
        return <div className="w-full h-full flex justify-center items-center"><Spinner /></div>
    }

    if (myDocs.isError) {
        return <div>Error!</div>
    }

    return (
        <div className="p-2 mx-auto w-3/12">
            <h2 className="text-center text-lg">Your docs</h2>
            <ul className="p-2 flex flex-col gap-1">
                {myDocs.data.docs.map(doc => (
                    <li className="p-2" key={doc.id}>
                        <Link className="rounded-md shadow-lg p-2 border flex items-center justify-between transition-all hover:bg-slate-100 " to={"/docs/" + doc.id}>
                            <span>{doc.title}</span>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                deleteDoc(doc.id, doc.title)
                            }} className="text-xs font-semibold text-red-400 hover:bg-red-100 p-2 h-fit w-fit box-border rounded-md transition-all">DELETE</button>
                        </Link>
                    </li>
                ))}
                <CreateNewDoc />
            </ul>
        </div>
    )
}

function CreateNewDoc() {
    const navigate = useNavigate();
    const [newDocName, setNewDocName] = useState<string>('');
    const newDocMutation = trpc.createNewDoc.useMutation({
        onSuccess: (data) => {
            toast('New doc created with success.', { type: 'success', position: 'top-center'});
            navigate('/docs/' + data.newDoc.id);
        },
        onError: (error) => {
            toast(JSON.parse(error.message)[0].message, { type: 'error', position: 'top-center'});
        }
    })

    const createDoc = () => {
        newDocMutation.mutate({
            title: newDocName
        })
    }

    return (
        <li className="p-2 flex gap-1">
            <input type="text" className="input" placeholder="New document" value={newDocName} onChange={(e: any) => setNewDocName(e.target.value)}/>
            <button onClick={createDoc} disabled={!newDocName.length} className="text-3xl border shadow rounded-lg px-3 text-white bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-40 disabled:hover:bg-blue-500">+</button>
        </li>
    )
}