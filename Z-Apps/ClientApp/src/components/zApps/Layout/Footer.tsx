import * as React from "react";
import { css } from "../../../common/util/getAphroditeClassName";
import { AuthorName } from "../../shared/Author";
import { Link } from "../../shared/Link/LinkWithYouTube";
import "./Footer.css";

const termOdUseStyle = css({
    "@media (max-width: 600px)": {
        marginTop: 8,
    },
});

export default function Footer() {
    return (
        <footer className="footer">
            <div className="center">
                <div className="container text-muted">
                    Copyright <AuthorName title="Developer" />. All rights
                    reserved.{" "}
                    <Link
                        to="/terms"
                        style={{ display: "inline-block" }}
                        className={termOdUseStyle}
                    >
                        Terms of Use
                    </Link>
                </div>
            </div>
        </footer>
    );
}
