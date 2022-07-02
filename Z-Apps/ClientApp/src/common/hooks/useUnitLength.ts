import { useEffect, useState } from "react";
import { debounce } from "../functions";

const setScreen = debounce((setUL: (UL: number) => void) => {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    if (screenWidth < screenHeight) {
        // 縦長なら幅と高さを入れ替えて計算
        screenWidth = window.innerHeight;
        screenHeight = window.innerWidth;
    }

    const UL = Math.min(screenWidth / 160, screenHeight / 90);
    setUL(UL);
}, 100);

export function useUnitLength() {
    const [UL, setUL] = useState(0);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setScreen(setUL);
        });

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                setScreen(setUL);
            }, i * 1000);
        }
    }, []);

    return UL;
}
