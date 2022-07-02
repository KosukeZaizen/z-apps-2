import { useEffect, useState } from "react";

export function DarkLayer({
    zIndex,
    onClick,
    transitionMilliseconds,
    open,
}: {
    zIndex: number;
    onClick: () => void;
    transitionMilliseconds: number;
    open: boolean;
}) {
    const [isShown, setShown] = useState(false);

    useEffect(() => {
        if (open) {
            setShown(open);
            return;
        }

        setTimeout(() => {
            setShown(false);
        }, transitionMilliseconds);
    }, [open, transitionMilliseconds]);

    if (!open && !isShown) {
        return null;
    }

    return (
        <div
            style={{
                zIndex,
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "black",
                opacity: open && isShown ? 0.7 : 0,
                width: "100%",
                height: "100%",
                transitionDuration: `${transitionMilliseconds}ms`,
                transitionProperty: "opacity",
            }}
            onClick={() => {
                onClick();
            }}
        />
    );
}
