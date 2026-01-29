import Navbar from '../components/Navbar'

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-redstone-500/30">
            <Navbar />
            <div className="pt-10">
                {children}
            </div>
        </div>
    )
}
