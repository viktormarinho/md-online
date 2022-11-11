import { useState } from "react";
import { trpc } from "../utils/trpc"

export default function App() {
  const util = trpc.useContext();
  const revalidateMessage = () => {
    util.getMessage.invalidate();
  }

  return (
    <div>
      <h1 className="text-3xl p-4 text-red-500 underline">Testing auth</h1>
      
      <SignUpForm />
      <ProtectedMessage />
      <button className="border border-black p-2" onClick={revalidateMessage}>Tentar puxar a mensagem de novo</button>
      <LoginForm />
    </div>
  )
}

function SignUpForm() {
  const signUpMutation = trpc.signUp.useMutation({
    onError: (error) => {
      console.error(error)
    },
    onSuccess: (data) => {
      console.log('Conta criada e sessão criada com sucesso')
      sessionStorage.setItem('sessionId', data.session.id)
    }
  });
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const onChange = (e: any) => {
    setSignUpData((prev) => ({...prev, [e.target.name]: e.target.value }))
  }

  const submit = (e: any) => {
    e.preventDefault();
    signUpMutation.mutate(signUpData)
  }

  return (
    <form onSubmit={submit} className="p-4">
      <input className="text-lg border rounded border-black" type="text" name="username" placeholder="username" onChange={onChange} value={signUpData.username}/><br /><br />
      <input className="text-lg border rounded border-black" type="email" name="email" placeholder="email"  onChange={onChange} value={signUpData.email}/><br /><br />
      <input className="text-lg border rounded border-black" type="password" name="password" placeholder="password"  onChange={onChange} value={signUpData.password}/><br /><br />
      <button className="text-xl border font-bold border-green-500 rounded p-2 bg-green-500 text-white hover:text-black hover:bg-green-200 transition-all " type="submit">Criar conta</button>
    </form>
  )
}

function ProtectedMessage() {
  const message = trpc.getMessage.useQuery();

  if (message.isLoading) {
    return <div>Loading message...</div>
  }

  if (message.isError) {
    return <div>{message.error.message}</div>
  }

  return (
    <div>{message.data.protectedMessage}</div>
  )
}

function LoginForm() {
  const loginMutation = trpc.login.useMutation({
    onError: (data) => {
      console.log(data.message)
    },
    onSuccess: (data) => {
      sessionStorage.setItem('sessionId', data.session.id)
      console.log('logado com sucesso!')
    }
  })
  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: ''
  })

  const onChange = (e: any) => {
    setLoginData((prev) => ({...prev, [e.target.name]: e.target.value }))
  }

  const submit = (e: any) => {
    e.preventDefault();
    loginMutation.mutate({
      email: loginData.emailOrUsername,
      username: loginData.emailOrUsername,
      password: loginData.password
    })
  }

  return (
    <form onSubmit={submit} className="p-4">
      <input className="text-lg border rounded border-black" type="text" name="emailOrUsername" placeholder="Email or username" onChange={onChange} value={loginData.emailOrUsername}/><br /><br />
      <input className="text-lg border rounded border-black" type="password" name="password" placeholder="password"  onChange={onChange} value={loginData.password}/><br /><br />
      <button className="text-xl border font-bold border-green-500 rounded p-2 bg-green-500 text-white hover:text-black hover:bg-green-200 transition-all " type="submit">Fazer login</button>
    </form>
  )
}