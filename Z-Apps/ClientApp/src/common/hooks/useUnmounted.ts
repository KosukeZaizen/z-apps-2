import { useEffect, useMemo } from "react";

let mountedIds: number[] = [];

export function useUnmounted() {
    const id = useMemo(() => {
        const id = mountedIds.length > 0 ? Math.max(...mountedIds) + 1 : 1;
        mountedIds.push(id);
        return id;
    }, []);

    useEffect(() => {
        return () => {
            mountedIds = mountedIds.filter(mid => mid !== id);
        };
    }, [id]);

    // Empty array will also return true.
    return {
        getIsUnmounted: () => mountedIds.every(mid => mid !== id),
    };
}
