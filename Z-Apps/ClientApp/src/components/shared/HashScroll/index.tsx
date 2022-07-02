import { Location } from "history";
import React, { AnchorHTMLAttributes, useEffect } from "react";
import { scrollToElement } from "../../zApps/Layout/NavMenu";

/**
 * ページ内遷移を実現する
 * @param {boolean} allLoadFinished - スクロールターゲットが画面上に存在していることが保証される時点でtrueにする
 * @param {Location} location - 同じターゲットに対して再度遷移する場合にも作動するように、locationオブジェクト自体の変更を検知する
 */
export function HashScroll({
    allLoadFinished,
    location,
}: {
    allLoadFinished: boolean;
    location: Location;
}) {
    useEffect(() => {
        const replacedHash = location.hash.replace("#", "");

        if (allLoadFinished && replacedHash) {
            document.getElementById(replacedHash)?.scrollIntoView(true);
        }
    }, [allLoadFinished, location]);

    return null;
}

export function AnchorLink({
    targetHash,
    isSmooth,
    ...rest
}: {
    targetHash: string;
    isSmooth?: boolean;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
    const replacedHash = targetHash.replace("#", "");
    return (
        <a
            href={targetHash}
            onClick={ev => {
                ev.preventDefault();

                if (isSmooth) {
                    scrollToElement(document.getElementById(replacedHash));
                    return;
                }

                document.getElementById(replacedHash)?.scrollIntoView(true);
            }}
            {...rest}
        />
    );
}
