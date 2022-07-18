import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import { useEffect, useState } from "react";
import { useAppState } from "../../../../common/appState";
import { sleepAsync } from "../../../../common/functions";
import { useScreenSize } from "../../../../common/hooks/useScreenSize";
import { useUser } from "../../../../common/hooks/useUser";
import { spaceBetween } from "../../../../common/util/Array/spaceBetween";
import ShurikenProgress from "../../Animations/ShurikenProgress";
import "../../CharacterComment/CharacterComment.css";
import { Markdown } from "../../Markdown";
import { RightPanel } from "../../Panel/RightPanel";
import { ScrollBox } from "../../ScrollBox";
import { UploadCameraButton } from "../UserAvatar/UploadCameraButton";

type OtherUser = {
    userId: number;
    name: string;
    level: number;
    avatarPath: string;
    bio: string;
};

export default function OtherUserPanel() {
    const [otherUserPanelState, setOtherUserPanelState] = useAppState(
        "otherUserPanelState"
    );

    const { user } = useUser();

    const [_targetUser, setTargetUser] = useState<OtherUser | undefined>(
        undefined
    );
    useEffect(() => {
        (async () => {
            if (otherUserPanelState === "closed") {
                await sleepAsync(500);
                setTargetUser(undefined);
                return;
            }
            const res = await fetch(
                "api/User/GetOtherUserInfo?userId=" +
                    otherUserPanelState.targetUserId
            );
            setTargetUser(await res.json());
        })();
    }, [otherUserPanelState]);

    const isMyself = !!user && user?.userId === _targetUser?.userId;
    const targetUser = isMyself ? user : _targetUser;

    return (
        <RightPanel
            open={otherUserPanelState !== "closed"}
            onClose={() => {
                setOtherUserPanelState("closed");
            }}
            panelWidth={1000}
        >
            <ContentsContainer targetUser={targetUser} isMyself={isMyself} />
        </RightPanel>
    );
}

function ContentsContainer({
    targetUser,
    isMyself,
}: {
    targetUser?: OtherUser;
    isMyself: boolean;
}) {
    if (!targetUser) {
        return <ShurikenProgress size="20%" style={{ marginTop: 100 }} />;
    }
    return <OtherUserArea targetUser={targetUser} isMyself={isMyself} />;
}

const OtherUserArea = ({
    targetUser,
    isMyself,
}: {
    targetUser: OtherUser;
    isMyself: boolean;
}) => {
    const { screenWidth } = useScreenSize();
    const c = useAuthorAreaStyles();

    const isCommentUsed = screenWidth > 767;
    const isVeryNarrow = screenWidth < 500;
    const imageSrc = targetUser.avatarPath
        ? targetUser.avatarPath.replace("150_150", "width300")
        : "";

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
                    isMyself={isMyself}
                />
            ) : (
                <div>
                    <div className={c.imgContainer}>
                        {imageSrc ? (
                            <img
                                src={imageSrc}
                                alt={targetUser.name}
                                title={targetUser.name}
                                className={c.img}
                            />
                        ) : (
                            <AlternativeAvatar
                                targetUser={targetUser}
                                isMyself={isMyself}
                            />
                        )}
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
    isMyself: boolean;
};
export function PersonComment({
    comment,
    style,
    commentStyle,
    targetUser,
    imageSrc,
    isMyself,
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
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={targetUser.name}
                        title={targetUser.name}
                        className={spaceBetween("ninjaPic", c.img)}
                    />
                ) : (
                    <AlternativeAvatar
                        targetUser={targetUser}
                        isMyself={isMyself}
                    />
                )}
            </div>
            <div
                className={imageSrc ? "userChatting" : "chatting"}
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

function AlternativeAvatar({
    targetUser,
    isMyself,
}: {
    targetUser: OtherUser;
    isMyself: boolean;
}) {
    const c = useAlternativeAvatarStyles();
    const [submitting, setSubmitting] = useState(false);

    return (
        <div className={c.container}>
            <Avatar className={c.avatar}>
                {submitting ? (
                    <ShurikenProgress
                        style={{ width: 100, height: 100 }}
                        size={60}
                    />
                ) : (
                    <PersonIcon className={c.personIcon} />
                )}
            </Avatar>

            {isMyself && (
                <UploadCameraButton
                    submitting={submitting}
                    setSubmitting={setSubmitting}
                    userId={targetUser.userId}
                    size={70}
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        margin: 0,
                    }}
                />
            )}
        </div>
    );
}
const useAlternativeAvatarStyles = makeStyles(({ palette }) => ({
    container: {
        width: "100%",
        maxWidth: 300,
        display: "flex",
        justifyContent: "center",
        position: "relative",
    },
    avatar: {
        width: "100%",
        maxWidth: 250,
        height: 250,
    },
    personIcon: { width: 200, height: 200 },
    label: { position: "absolute", right: -7, bottom: -5, margin: 0 },
    cameraButton: {
        borderRadius: "50%",
        maxWidth: 30,
        maxHeight: 30,
        minWidth: 30,
        minHeight: 30,
        backgroundColor: palette.grey[800],
        color: "white",
        transition: "all 200ms",
        "&:hover": {
            backgroundColor: palette.grey[600],
        },
        transform: "scale(0.8)",
    },
    cameraIcon: { width: 20, height: 20 },
    input: { display: "none" },
}));

