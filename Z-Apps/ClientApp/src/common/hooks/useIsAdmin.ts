import { useEffect } from "react";

export function useIsAdmin() {
    useEffect(() => {
        if (localStorage.getItem("isAdmin")) {
            return;
        }
        localStorage.setItem("isAdmin", "yes");
        location.reload();
    }, []);
}
