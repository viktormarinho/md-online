import { trpc } from "../utils/trpc"

export default function App() {
  const hello = trpc.hello.useQuery({ name: 'Viktor' })

  if (hello.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl text-red-500 underline">My app</h1>
      <p>{hello.data}</p>
    </div>
  )
}