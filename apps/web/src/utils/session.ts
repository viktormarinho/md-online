import { useEffect, useState } from 'react';
import { getSession } from './../AppRoot';

export type User = {
    id: string
    username: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
}

export async function getSessionUser() {
    const data = (await (
        await fetch('http://localhost:3000/trpc/validate?batch=1&input=%7B%7D', { headers: { authorization: getSession() }})
        ).json())[0];

    if (data.error) {
        if (data.error.message !== 'UNAUTHORIZED') {
            console.log(data.error.message)
        }
        return null;
    }

    return data.result.data.user as User;
}

type useSessionProps = {
    onSessionNull?: Function
    onSessionExists?: Function
}

export function useSession({ onSessionNull, onSessionExists }: useSessionProps) {
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSessionUser().then(user => {
            if (!user && onSessionNull) {
                onSessionNull();
                return
            }

            if (user && onSessionExists) {
                onSessionExists();
            }

            setUser(user!);
            setIsLoading(false);
        });
    }, [])

    return { data: { user }, isLoading };
}