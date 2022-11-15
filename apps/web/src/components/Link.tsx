import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link as RouterLink, LinkProps } from 'react-router-dom'

import { routes } from '../Routes'

const getMatchingRoute = (path: string) => {
    const routeDynamicSegments = /:\w+|\*/g
    return routes.find((route) => path.match(new RegExp(route.path.replace(routeDynamicSegments, '.*')))?.[0] === path)
}

type Props = LinkProps & { prefetch?: boolean }

export const Link = ({ children, to, prefetch = true, ...props }: Props) => {
    const ref = useRef<HTMLAnchorElement>(null)
    const [prefetched, setPrefetched] = useState(false)

    const route = useMemo(() => getMatchingRoute(to as string), [to])
    const preload = useCallback(() => route?.preload() && setPrefetched(true), [route])
    const prefetchable = Boolean(route && !prefetched)

    useEffect(() => {
        if (prefetchable && prefetch && ref?.current) {
            const observer = new IntersectionObserver(
                (entries) => entries.forEach((entry) => entry.isIntersecting && preload()),
                { rootMargin: '200px' }
            )

            observer.observe(ref.current)
            return () => observer.disconnect()
        }
    }, [prefetch, prefetchable, preload])

    return (
        <RouterLink ref={ref} to={to} {...props}>
            {children}
        </RouterLink>
    )
}