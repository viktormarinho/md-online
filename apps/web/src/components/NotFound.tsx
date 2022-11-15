import { Link } from "./Link";


export function NotFound() {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <img className="w-60 h-60" src="https://ih1.redbubble.net/image.1071389577.1660/st,small,507x507-pad,600x600,f8f8f8.jpg" alt="Sad bee crying" />
            <p className="text-xl font-bold text-red-500 mt-12">Error 404 - Not found</p>
            <h1 className="text-2xl">Could not find this page. If this is unexpected, please check the link and try again.</h1>
            <Link className="rounded-md hover:bg-slate-100 transition-all border shadow-lg p-2" to="/">Back to homepage</Link>
        </div>
    )
}