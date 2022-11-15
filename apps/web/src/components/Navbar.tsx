import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../utils/session";
import { trpc } from "../utils/trpc";
import { Link } from "./Link";


export function Navbar({ user }: { user: User | undefined}) {
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
        <nav className="flex justify-between p-4">
            <h1 className="text-2xl"><Link to="/">Markdown online</Link></h1>
            <div className="flex items-center gap-8">
                <p className="text-lg">Logged in as {user?.username}</p>
                <button className="rounded-lg py-1 px-3 shadow-lg border hover:bg-slate-100 transition-all" onClick={logout}>Logout</button>
            </div>
        </nav>
    )
}