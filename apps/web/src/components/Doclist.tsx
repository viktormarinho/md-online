import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { trpc } from "../utils/trpc";
import { Link } from "./Link";
import { Spinner } from "./Spinner";


export function Doclist() {
    const myDocs = trpc.getMyDocs.useQuery();

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
                        <Link className="rounded-md shadow-lg p-2 border block transition-all hover:bg-slate-100" to={"/docs/" + doc.id}>
                            {doc.title}
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
        <li className="p-2 flex gap-1 flex-1">
            <input type="text" className="input" placeholder="New document" value={newDocName} onChange={(e: any) => setNewDocName(e.target.value)}/>
            <button onClick={createDoc} disabled={!newDocName.length} className="text-3xl border shadow rounded-lg  px-3 text-white bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-40 disabled:hover:bg-blue-500">+</button>
        </li>
    )
}