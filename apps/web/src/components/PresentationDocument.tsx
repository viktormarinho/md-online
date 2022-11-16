import { trpc } from "../utils/trpc"
import { ForbiddenDoc } from "./ForbiddenDoc";
import { NotFound } from "./NotFound";
import { Spinner } from "./Spinner";
import ReactMarkdown from 'react-markdown';
import { Link } from "./Link";


export function PresentationDocument({id}: { id: string }) {
    const doc = trpc.getOneDoc.useQuery({ id }, { refetchOnWindowFocus: false, cacheTime: 0, retry: (failureCount, error) => {
        if (error.data?.code === 'UNAUTHORIZED') return false;
        if (error.data?.code === 'NOT_FOUND') return false;
        return true;
    }});

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
        <div className="mx-auto w-1/2">
            <Link to={'/docs/' + id} className="absolute z-10 top-20 left-4 text-center block mt-2 rounded-lg shadow-lg text-white bg-blue-500 border py-1 px-2">
                Back to edit mode
            </Link>
            <ReactMarkdown className="markdown border shadow-lg">
               {doc.data?.doc.content ?? ''}
            </ReactMarkdown>
        </div>
    )
}