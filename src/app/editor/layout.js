export default function Layout({children})
{
    return (
        <div className="w-full h-screen flex bg-amber-400">
            <div className="h-full flex-1 bg-amber-600">
                {children}
            </div>
        </div>
    );
}