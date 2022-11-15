import { useNavigate } from "react-router-dom";
import { Doclist } from "../components/Doclist";
import { Navbar } from "../components/Navbar";
import { Spinner } from "../components/Spinner";
import { User, useSession } from "../utils/session";


export default function DocsRoute() {
    const navigate = useNavigate();
    const { data, isLoading } = useSession({
        onSessionNull: () => {
            navigate('/login');
        }
    });

    if (isLoading) {
        return <div className="w-full h-full flex justify-center items-center"><Spinner /></div>
    }

    return <DocsPage user={data.user}/>;
}

function DocsPage({ user }: { user: User | undefined}) {

    return (
        <div>
            <Navbar user={user} />
            <Doclist />
        </div>
    )
}