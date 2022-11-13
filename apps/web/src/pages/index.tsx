import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Doclist } from "../components/Doclist";
import { Spinner } from "../components/Spinner";
import { User, useSession } from "../utils/session";
import { trpc } from "../utils/trpc";


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

    return (
        <DocsPage user={data.user}/>
    )
}

function DocsPage({ user }: { user: User | undefined}) {
    const navigate = useNavigate();
    const logoutMutation = trpc.endSession.useMutation({
        onSuccess: ({ msg }) => {
            toast(msg, { type: 'success', position: 'top-center' });
            localStorage.removeItem('sessionId');
            navigate('/login');
        }
    })

    const logout = () => {
        logoutMutation.mutate();
    }

    return (
        <div>
            <h1>Welcome, {user?.username} - <button onClick={logout}>Logout</button></h1>
            <Doclist />
        </div>
    )
}