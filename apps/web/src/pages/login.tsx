import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { SignUpForm } from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";
import { useSession } from "../utils/session";
import { Spinner } from "../components/Spinner";


export default function LoginRoute() {
  const navigate = useNavigate();
  const { isLoading } = useSession({ onSessionExists: () => {
    navigate('/');
  }});

  if (isLoading) {
    return <div className="w-full h-full flex justify-center items-center"><Spinner /></div>
  }

  return <LoginPage />;
}

function LoginPage() {
  const [registering, setRegistering] = useState(false);

  return (
    <div>
      <header className="mt-24 text-center">
        <h1 className="text-xl">Online markdown editor - by <a className="text-blue-500" target="_blank" href="https://github.com/viktormarinho" rel="noreferrer">@viktormarinho</a></h1>
      </header>
      {registering ? <SignUpForm /> : <LoginForm />}
      <button className="mx-auto block mt-2 text-blue-500" onClick={() => setRegistering(prev => !prev)}>{registering ? 'I already have an account' : "Don't have an account?"}</button>
    </div>
  )
}