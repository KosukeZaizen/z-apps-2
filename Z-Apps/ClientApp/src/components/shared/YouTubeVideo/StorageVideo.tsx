import React, { CSSProperties } from "react";
import Button from "reactstrap/lib/Button";
import { BLOB_URL } from "../../../common/consts";
import { sendClientOpeLog } from "../../../common/functions";
import { getHoverClassName } from "../../../common/util/getHoverClass";
import { ATargetBlank } from "../Link/ATargetBlank";

const buttonHover = getHoverClassName({
    opacity: 0.5,
});

export interface StorageVideoProps {
    path: string;
    screenWidth: number;
    pageNameForLog: string;
    style?: CSSProperties;
    buttonLabel?: string;
}

export function StorageVideo(props: StorageVideoProps) {
    return <Video isStorage {...props} />;
}

export interface VideoProps extends StorageVideoProps {
    isStorage?: boolean;
}

export function Video({
    path,
    screenWidth,
    pageNameForLog,
    style,
    buttonLabel,
    isStorage,
}: VideoProps) {
    const isWide = screenWidth > 600;
    return (
        <div
            style={{
                backgroundColor: isWide ? "rgb(231, 233, 231)" : undefined,
                padding: "5px 0",
                border: 0,
                ...style,
            }}
        >
            <div style={{ maxWidth: 600 }}>
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        paddingTop: "56.25%",
                    }}
                >
                    <video
                        src={isStorage ? `${BLOB_URL}/${path}` : path}
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "100%",
                            height: "100%",
                        }}
                        controls
                    />
                </div>
                <ATargetBlank
                    nofollow
                    href="http://www.youtube.com/channel/UCii35PcojqMUNkSRalUw35g?sub_confirmation=1"
                    onClick={() => {
                        setTimeout(() => {
                            sendClientOpeLog(
                                "click YouTube channel",
                                `from ${pageNameForLog} video bottom`
                            );
                        }, 1000);
                    }}
                >
                    <Button
                        style={{
                            marginTop: 5,
                            width: "100%",
                            backgroundColor: "red",
                            color: "white",
                        }}
                        className={buttonHover}
                    >
                        {buttonLabel ||
                            "Click to subscribe to this YouTube channel!"}
                    </Button>
                </ATargetBlank>
            </div>
        </div>
    );
}
