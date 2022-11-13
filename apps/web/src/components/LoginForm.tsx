import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { trpc } from "../utils/trpc"


export function LoginForm() {
    const navigate = useNavigate();
    const loginMutation = trpc.login.useMutation({
      onError: (error) => {
        if(error.data?.code === 'NOT_FOUND') {
            toast('Usuário não encontrado', { type: 'error', position: 'top-center' })
        }

        if(error.data?.code === 'UNAUTHORIZED') {
            toast('Senha incorreta', { type: 'error', position: 'top-center' })
        }
      },
      onSuccess: (data) => {
        localStorage.setItem('sessionId', data.session.id)
        toast('Logado com sucesso', { type: 'success', position: 'top-center'})
        navigate('/');
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
      <form onSubmit={submit} className="p-4 w-96 mx-auto flex flex-col items-center shadow border rounded-xl mt-16">
        <label className="self-start pl-1 pb-1">Email</label>
        <input 
         className="input"
         type="text" 
         name="emailOrUsername" 
         placeholder="Email or username" 
         onChange={onChange} 
         value={loginData.emailOrUsername}
         />
         <br />
        <label className="self-start pl-1 pb-1">Password</label>
        <input 
         className="input" 
         type="password" 
         name="password" 
         placeholder="Password"  
         onChange={onChange} 
         value={loginData.password}
         />
         <br />
        <button className="text-lg border shadow rounded-lg py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 transition-all" type="submit">Login</button>
      </form>
    )
}