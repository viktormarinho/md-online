import { useNavigate, useParams } from "react-router-dom";
import { PresentationDocument } from "../../components/PresentationDocument";
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

    return <PresentationPage docId={id} user={data.user!} />;
}

function PresentationPage({ docId, user }: { docId: string, user: User }) {

    return (
        <div className="w-screen h-screen">
            <Navbar user={user} />
            <PresentationDocument id={docId} />
        </div>
    )
}