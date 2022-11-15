
export function ForbiddenDoc() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-xl">Forbidden: You do not have permission to see this document.</h1>
            <p className="text-lg">If this is unexpected, you can talk to the document owner and have him authorize your user.</p>
        </div>
    )
}