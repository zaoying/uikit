import { Inter } from 'next/font/google';
import { CommonNavbar } from './common';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Demo',
    description: 'A demo for dependency injection uikit',
}

export default function RootLayout(props: { children: React.ReactNode }) {
    return <html lang="en">
        <body className={inter.className}>
            <CommonNavbar>{props.children}</CommonNavbar>
        </body>
    </html>
}
