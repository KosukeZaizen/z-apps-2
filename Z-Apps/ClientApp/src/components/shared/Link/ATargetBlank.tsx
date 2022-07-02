import React, { AnchorHTMLAttributes } from "react";
import { A } from "./LinkWithYouTube";

export function ATargetBlank(
    props: AnchorHTMLAttributes<HTMLAnchorElement> & { nofollow?: boolean }
) {
    const { nofollow, children, ...rest } = props;

    const rel = nofollow
        ? "nofollow noopener noreferrer"
        : "noopener noreferrer";

    return (
        <A target="_blank" rel={rel} {...rest}>
            {children}
        </A>
    );
}

export function ATargetBlankWithoutYouTube(
    props: AnchorHTMLAttributes<HTMLAnchorElement> & { nofollow?: boolean }
) {
    const { nofollow, children, ...rest } = props;

    const rel = nofollow
        ? "nofollow noopener noreferrer"
        : "noopener noreferrer";

    return (
        <a target="_blank" rel={rel} {...rest}>
            {children}
        </a>
    );
}
