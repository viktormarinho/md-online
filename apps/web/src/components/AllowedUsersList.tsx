import { useState } from "react";
import { toast } from "react-toastify";
import { DocType } from "../utils/DocType";
import { trpc } from "../utils/trpc";


export function AllowedUsersList({ doc }: { doc: DocType}) {
    const [usernameOrEmail, setUsernameOrEmail] = useState<string>('');
    const [allowedUsers, setAllowedUsers] = useState(doc.allowedUsers);
    const addAllowedUserMutation = trpc.addAllowedUser.useMutation({
        onSuccess: (data) => {
            toast('Added user with success', { position: 'top-center', type: 'success' });
            setAllowedUsers(data.allowedUsers);
        },
        onError: (error) => {
            if (error.data?.code === 'NOT_FOUND') {
                toast('User not found', { position: 'top-center', type: 'error' });
            }

            if (error.data?.code === 'UNAUTHORIZED') {
                toast('You are not allowed to add users to this document', { position: 'top-center', type: 'error' })
            }
        }
    });

    const addAllowedUser = () => {
        addAllowedUserMutation.mutate({
            docId: doc.id,
            email: usernameOrEmail,
            username: usernameOrEmail,
        })
    }

    return (
        <div className="mt-4 w-full px-2 flex flex-col gap-1">
            <h2 className="text-lg text-center mt-2">Allowed users</h2>
            <ul>
                {allowedUsers.map((user) => <li className="text-center">{user.username}</li>)}
            </ul>
            <input type="text" className="input" placeholder="Username or email" value={usernameOrEmail} onChange={(e: any) => setUsernameOrEmail(e.target.value)}/>
            <button onClick={addAllowedUser} className="block rounded-lg shadow-lg text-white bg-blue-500 w-full border py-1 px-2 disabled:opacity-40">Add</button>
        </div>
    )

}