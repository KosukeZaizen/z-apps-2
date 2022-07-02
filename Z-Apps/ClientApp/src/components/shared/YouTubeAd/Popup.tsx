import React, { useEffect } from "react";
import { YouTubeAd } from ".";
import { getAppState } from "../../../common/appState";

export const youTubeAdClosedStorageKey = "YouTubeAdClosed";

export const PopupAd = () => {
    const [isShown, setIsShown] = React.useState(false);
    const [isTimerStarted, setIsTimerStarted] = React.useState(false);

    useEffect(() => {
        setTimeout(() => {
            const savedDate = localStorage.getItem(youTubeAdClosedStorageKey);
            if (savedDate) {
                const date = new Date(savedDate);
                const dif = new Date().getTime() - date.getTime();
                if (dif < 1000 * 60 * 60 * 24 * 14) {
                    // ２週間出さない
                    return;
                }
            }

            if (getAppState().isNoYouTubeAdMode) {
                // No YouTube AD mode
                return;
            }

            const showAd = () => {
                document.removeEventListener("scroll", showAd);
                setIsTimerStarted(true);
                setTimeout(() => setIsShown(true), 10);
            };
            document.addEventListener("scroll", showAd);
        }, 30 * 1000);
    }, []);

    if (!isTimerStarted) {
        return null;
    }

    const maxWidth = 500;
    const shorterLine = Math.min(window.innerWidth, window.innerHeight);
    const adWidth = shorterLine < maxWidth ? shorterLine : maxWidth;

    const close = () => {
        localStorage.setItem(
            youTubeAdClosedStorageKey,
            new Date().toISOString()
        );
        setIsTimerStarted(false);
    };

    return (
        <div
            style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                opacity: isShown ? 1 : 0,
                transition: "2s",
            }}
        >
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "gray",
                    opacity: 0.5,
                }}
            ></div>

            <div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: adWidth - 20,
                        height: adWidth,
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        borderRadius: 10,
                        zIndex: 2147483647,
                    }}
                    onClick={ev => ev.stopPropagation()}
                >
                    <YouTubeAd width={adWidth - 60} />
                    <div
                        onClick={close}
                        style={{ cursor: "pointer", color: "black" }}
                    >
                        Close
                    </div>
                </div>
            </div>
        </div>
    );
};
