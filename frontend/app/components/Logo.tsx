import Link from 'next/link'
import RedstoneLogo from './RedstoneLogo'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg'
    showText?: boolean
}

const sizes = {
    sm: 24,
    md: 32,
    lg: 48,
}

export default function Logo({ size = 'md', showText = false }: LogoProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    }

    return (
        <Link href="/" className="flex items-center gap-2">
            <RedstoneLogo className={`${sizeClasses[size]}`} />
            {showText && <span className="font-bold text-lg text-dark-900">Redstone</span>}
        </Link>
    )
}
