import * as React from "react";
import { css } from "../../../common/util/getAphroditeClassName";
import { Link } from "../../shared/Link/LinkWithYouTube";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="center">
                <div className="container text-muted">
                    Copyright <Link to="/developer">Kosuke Zaizen</Link>. All
                    rights reserved.{" "}
                    <Link
                        to="/terms"
                        style={{ display: "inline-block" }}
                        className={css({
                            "@media (max-width: 600px)": {
                                marginTop: 8,
                            },
                        })}
                    >
                        Terms of Use
                    </Link>
                </div>
            </div>
        </footer>
    );
}
