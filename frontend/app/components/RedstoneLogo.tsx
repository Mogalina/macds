import React from 'react'

export default function RedstoneLogo({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path d="M16 2L3 9.5V22.5L16 30L29 22.5V9.5L16 2Z" fill="#E11D48" />
            <path d="M16 2L16 16" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
            <path d="M16 16L29 9.5" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
            <path d="M16 16L3 9.5" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
            <path d="M16 30L16 16" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
            <path d="M29 22.5L16 16" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
            <path d="M3 22.5L16 16" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="3" fill="white" fillOpacity="0.1" />
        </svg>
    )
}
