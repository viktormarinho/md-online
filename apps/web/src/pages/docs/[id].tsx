import { useNavigate, useParams } from "react-router-dom";
import { Document } from "../../components/Document";
import { Navbar } from "../../components/Navbar";
import { NotFound } from "../../components/NotFound";
import { Spinner } from "../../components/Spinner";
import { User, useSession } from "../../utils/session";


export default function DocRoute() {
    const navigate = useNavigate();
    const { data, isLoading } = useSession({
        onSessionNull: () => {
            navigate('/login');
        }
    })
    const { id } = useParams();

    if (isLoading) {
        return <div className="w-full h-full flex justify-center items-center"><Spinner /></div>
    }

    if (!id) {
        return <NotFound />;
    }

    return <DocPage docId={id} user={data.user!} />;
}

function DocPage({ docId, user }: { docId: string, user: User }) {

    return (
        <div className="w-screen h-screen overflow-hiddend">
            <Navbar user={user}/>
            <Document id={docId} />
        </div>
    )
}