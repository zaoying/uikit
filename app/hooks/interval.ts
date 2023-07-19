import { useEffect } from "react"

export function useInterval(callback: ()=>void, interval?: number) {
    useEffect(() => {
        const id =setInterval(callback, interval)
        return () => clearInterval(id)
    }, [])
}