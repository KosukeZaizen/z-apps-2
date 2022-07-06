import { AnchorHTMLAttributes } from "react";
import {
    Link as OriginalLink,
    LinkProps as OriginalLinkProps,
} from "react-router-dom";

/**
 * ↓↓↓ Stopped to promote YouTube ↓↓↓
 */

// const seenVideoStorageKey = "seenVideoStorageKey-";
// const youTubeVideoUrls = {
//     beginner_grammar1: "https://youtu.be/6gdQS1djlL8",
//     how_to_say_you: "https://youtu.be/CHFBq9xjOD4",
//     how_to_say_do: "https://youtu.be/K1sDYLPunJ8",
//     channel_page: youtubeChannelUrl,
// } as const;

// const unseenVideo = Object.keys(youTubeVideoUrls).find(
//     k => !recentlyAccessed(localStorage.getItem(seenVideoStorageKey + k))
// ) as keyof typeof youTubeVideoUrls | null;

// function recentlyAccessed(strSavedDate: string | null): boolean {
//     if (strSavedDate) {
//         const date = new Date(strSavedDate);
//         const dif = new Date().getTime() - date.getTime();
//         if (dif < 1000 * 60 * 60 * 24) {
//             // Accessed within 24 hour
//             return true;
//         }
//     }
//     return false;
// }

export function Link(props: OriginalLinkProps) {
    // const [isNoYouTubeAdMode] = useAppState("isNoYouTubeAdMode");

    return <OriginalLink {...props} />;

    /**
     * ↓↓↓ Stopped to promote YouTube ↓↓↓
     */

    // if (unseenVideo && !isNoYouTubeAdMode) {
    //     const { onClick, to, ...rest } = props;
    //     return (
    //         <a
    //             target="_blank"
    //             rel={"noopener noreferrer"}
    //             href={to as string}
    //             {...rest}
    //             onClick={(...args) => {
    //                 onClick?.(...args);
    //                 setTimeout(() => {
    //                     location.href = youTubeVideoUrls[unseenVideo];
    //                 }, 1000);
    //                 localStorage.setItem(
    //                     seenVideoStorageKey + unseenVideo,
    //                     new Date().toISOString()
    //                 );
    //             }}
    //         />
    //     );
    // }
    // return <OriginalLink {...props} />;
}

export function A(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
    // const [isNoYouTubeAdMode] = useAppState("isNoYouTubeAdMode");

    return <a {...props} />;

    /**
     * ↓↓↓ Stopped to promote YouTube ↓↓↓
     */

    // if (unseenVideo && !isNoYouTubeAdMode) {
    //     const { onClick, ...rest } = props;
    //     return (
    //         <a
    //             target="_blank"
    //             rel={"noopener noreferrer"}
    //             {...rest}
    //             onClick={(...args) => {
    //                 onClick?.(...args);
    //                 setTimeout(() => {
    //                     location.href = youTubeVideoUrls[unseenVideo];
    //                 }, 1000);
    //                 localStorage.setItem(
    //                     seenVideoStorageKey + unseenVideo,
    //                     new Date().toISOString()
    //                 );
    //             }}
    //         />
    //     );
    // }
    // if (
    //     isNoYouTubeAdMode &&
    //     props.href?.includes(ARTICLES_DOMAIN) &&
    //     !window.navigator.userAgent.includes("bot") &&
    //     !props.href.includes("#")
    // ) {
    //     // Inherit NoYouTubeMode to Articles.
    //     // But bots don't need it, and if the URL already includes "#",
    //     // it should not be added again.
    //     return <a {...props} href={props.href + "#n"} />;
    // }
    // return <a {...props} />;
}
