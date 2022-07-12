import * as React from "react";
import * as consts from "../../../common/consts";
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
    return (
        <div
            style={style}
            ref={containerRef}
            className="characterCommentContainer"
        >
            <div className="ninjaPicContainer">
                <img
                    src={`${consts.BLOB_URL}/vocabulary-quiz/img/ninja${imgNumber}.png`}
                    alt="Japanese ninja"
                    style={{
                        width: (screenWidth * 2) / 10,
                        ...imgStyle,
                    }}
                    className="ninjaPic"
                />
            </div>
            <div className="chatting">
                <div
                    className="says character-says"
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
