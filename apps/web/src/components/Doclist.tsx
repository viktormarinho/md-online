import { trpc } from "../utils/trpc";
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
        <div>
            <ul>
                {myDocs.data.docs.map(doc => <li>{doc.title}</li>)}
                <li>Create new doc</li>
            </ul>
        </div>
    )
}