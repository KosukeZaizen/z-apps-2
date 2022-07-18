import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
import { useAppState } from "../../../../common/appState";
import { sleepAsync } from "../../../../common/functions";
import { useScreenSize } from "../../../../common/hooks/useScreenSize";
import { spaceBetween } from "../../../../common/util/Array/spaceBetween";
import ShurikenProgress from "../../Animations/ShurikenProgress";
import "../../CharacterComment/CharacterComment.css";
import { Markdown } from "../../Markdown";
import { RightPanel } from "../../Panel/RightPanel";
import { ScrollBox } from "../../ScrollBox";

type OtherUser = {
    userId: number;
    name: string;
    level: number;
    avatarPath: string;
    bio: string;
};

export default function OtherUserPanel() {
    const [userPanelState, setUserPanelState] = useAppState(
        "otherUserPanelState"
    );

    const [targetUser, setTargetUser] = useState<OtherUser | null>(null);
    useEffect(() => {
        sleepAsync(1000).then(() => {
            setTargetUser({
                userId: 1,
                name: "Kosuke",
                level: 100,
                avatarPath: "",
                bio: "hello!",
            });
        });
    }, [useAppState]);

    return (
        <RightPanel
            open={userPanelState !== "closed"}
            onClose={() => {
                setUserPanelState("closed");
            }}
            panelWidth={1000}
        >
            <ContentsContainer targetUser={targetUser} />
        </RightPanel>
    );
}

function ContentsContainer({ targetUser }: { targetUser: OtherUser | null }) {
    if (!targetUser) {
        return <ShurikenProgress size="20%" style={{ marginTop: 100 }} />;
    }
    return <OtherUserArea targetUser={targetUser} />;
}

export const OtherUserArea = ({ targetUser }: { targetUser: OtherUser }) => {
    const { screenWidth } = useScreenSize();
    const c = useAuthorAreaStyles();

    const isCommentUsed = screenWidth > 767;
    const isVeryNarrow = screenWidth < 500;
    const imageSrc = targetUser.avatarPath || "";

    return (
        <ScrollBox style={{ textAlign: "center" }}>
            <h2 className={c.title}>{targetUser.name}</h2>
            {isCommentUsed ? (
                <PersonComment
                    targetUser={targetUser}
                    imageSrc={imageSrc}
                    screenWidth={screenWidth}
                    comment={
                        <div className={c.markdownContainer}>
                            <Markdown
                                style={{
                                    margin: 5,
                                    textAlign: "left",
                                    fontSize: "large",
                                }}
                                source={targetUser.bio}
                            />
                        </div>
                    }
                />
            ) : (
                <div>
                    <div className={c.imgContainer}>
                        <img
                            src={imageSrc}
                            alt={targetUser.name}
                            title={targetUser.name}
                            className={c.img}
                        />
                    </div>
                    <div
                        className={
                            isVeryNarrow
                                ? c.spNarrowMessageContainer
                                : c.spMessageContainer
                        }
                    >
                        <Markdown
                            style={{
                                textAlign: "left",
                                margin: isVeryNarrow ? "5px 0" : 5,
                                fontSize: isVeryNarrow ? "medium" : undefined,
                            }}
                            source={targetUser.bio}
                        />
                    </div>
                </div>
            )}
        </ScrollBox>
    );
};
const useAuthorAreaStyles = makeStyles(() => ({
    title: { marginBottom: 25 },
    greeting: {
        width: "100%",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "15px 5px 25px",
    },
    markdownContainer: { margin: 10 },
    imgContainer: { margin: "0 auto 20px" },
    img: {
        width: "100%",
        maxWidth: 300,
        objectFit: "contain",
        margin: "auto",
    },
    spMessageContainer: {
        margin: 10,
        fontSize: "large",
        textAlign: "left",
        padding: 10,
    },
    spNarrowMessageContainer: {
        margin: "10px 0",
        fontSize: "large",
        textAlign: "left",
        padding: 0,
    },
    spGreeting: {
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "0 5px 25px",
    },
    spNarrowGreeting: {
        fontWeight: "bold",
        fontSize: "x-large",
        margin: "0 0 25px",
    },
}));

type CommentProps = {
    screenWidth: number;
    comment: string | React.ReactNode;
    style?: React.CSSProperties;
    commentStyle?: React.CSSProperties;
    targetUser: OtherUser;
    imageSrc: string;
};
export function PersonComment({
    comment,
    style,
    commentStyle,
    targetUser,
    imageSrc,
}: CommentProps) {
    const c = usePersonCommentStyles();

    return (
        <div
            style={{
                display: "flex",
                ...style,
            }}
        >
            <div className={c.imgContainer}>
                <img
                    src={imageSrc}
                    alt={targetUser.name}
                    title={targetUser.name}
                    className={spaceBetween("ninjaPic", c.img)}
                />
            </div>
            <div
                className="chatting"
                style={{
                    flex: 2,
                }}
            >
                <div
                    className="says"
                    style={{
                        width: "100%",
                        ...commentStyle,
                    }}
                >
                    {comment}
                </div>
            </div>
        </div>
    );
}
const usePersonCommentStyles = makeStyles(() => ({
    imgContainer: { flex: 1, marginTop: 6, marginRight: 10 },
    img: {
        maxWidth: 300,
        height: "auto",
        verticalAlign: "top",
    },
}));

