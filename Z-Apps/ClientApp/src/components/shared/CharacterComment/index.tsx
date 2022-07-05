import Collapse from "@material-ui/core/Collapse";
import * as React from "react";
import { useState } from "react";
import * as consts from "../../../common/consts";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import "./CharacterComment.css";

type TProps = {
    imgNumber: number;
    screenWidth: number;
    comment: string | React.ReactNode;
    style?: React.CSSProperties;
    commentStyle?: React.CSSProperties;
    imgStyle?: React.CSSProperties;
    containerRef?: React.RefObject<HTMLDivElement>;
};
export default function CharacterComment(props: TProps) {
    const {
        imgNumber,
        screenWidth,
        comment,
        style,
        commentStyle,
        imgStyle,
        containerRef,
    } = props;
    const [imgIn, setImgIn] = useState(false);

    return (
        <div
            style={style}
            ref={containerRef}
            className="characterCommentContainer"
        >
            <div style={{ flex: 1 }}>
                <Collapse
                    in={imgIn}
                    timeout={500}
                    className="characterCommentImgCollapse"
                >
                    <img
                        src={`${consts.BLOB_URL}/vocabulary-quiz/img/ninja${imgNumber}.png`}
                        alt="Japanese ninja"
                        style={{
                            width: (screenWidth * 2) / 10,
                            ...imgStyle,
                        }}
                        className={spaceBetween(
                            "ninjaPic",
                            "t500ms",
                            imgIn ? "opacity1" : "opacity0"
                        )}
                        onLoad={() => {
                            setImgIn(true);
                        }}
                    />
                </Collapse>
            </div>
            <div className="chatting">
                <div
                    className="says"
                    style={{
                        width:
                            screenWidth > 767
                                ? (screenWidth * 7) / 10 - 15
                                : "100%",
                        ...commentStyle,
                    }}
                >
                    {comment}
                </div>
            </div>
        </div>
    );
}
