import { useState } from "react";
import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
    const navigate = useNavigate();
    const signUpMutation = trpc.signUp.useMutation({
      onError: (error) => {
        toast(JSON.parse(error.message)[0].message, { type: 'error', position: "top-center" })
      },
      onSuccess: (data) => {
        toast('Conta criada com sucesso.', { type: 'success', position: "top-center" })
        localStorage.setItem('sessionId', data.session.id)
        navigate('/');
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
      <form onSubmit={submit} className="p-4 w-96 mx-auto flex flex-col items-center justify-start shadow border rounded-xl mt-16">
        <label className="self-start pl-1 pb-1">Username</label>
        <input className="input" type="text" name="username" placeholder="Username" onChange={onChange} value={signUpData.username}/><br />
        <label className="self-start pl-1 pb-1">Email</label>
        <input className="input" type="email" name="email" placeholder="Email"  onChange={onChange} value={signUpData.email}/><br />
        <label className="self-start pl-1 pb-1">Password</label>
        <input className="input" type="password" name="password" placeholder="Password"  onChange={onChange} value={signUpData.password}/><br />
        <button className="text-lg border shadow rounded-lg py-2 px-4 text-white bg-blue-500 hover:bg-blue-600 transition-all" type="submit">Create Account</button>
      </form>
    )
  }