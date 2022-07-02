import React, { AnchorHTMLAttributes } from "react";
import { LinkProps } from "react-router-dom";
import { ATargetBlank } from "./ATargetBlank";
import { Link } from "./LinkWithYouTube";

export function LinkOrA(
    props:
        | AnchorHTMLAttributes<HTMLAnchorElement>
        | (LinkProps & { href: string })
) {
    const { href, ...rest } = props;
    if (!href) {
        return null;
    }

    if (href.startsWith("https://")) {
        return <ATargetBlank {...props} />;
    }
    return <Link to={href} {...rest} />;
}
