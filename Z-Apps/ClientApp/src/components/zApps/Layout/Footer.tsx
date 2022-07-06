import { makeStyles } from "@material-ui/core/styles";
import { spaceBetween } from "../../../common/util/Array/spaceBetween";
import { AuthorName } from "../../shared/Author";
import { Link } from "../../shared/Link/LinkWithYouTube";
import "./Footer.css";

export default function Footer() {
    const c = useFooterStyles();
    return (
        <footer className="footer">
            <div className="center">
                <div className="container text-muted">
                    Copyright <AuthorName title="Developer" />. All rights
                    reserved.{" "}
                    <Link
                        to="/terms"
                        className={spaceBetween(
                            c.termOdUseStyle,
                            "inline-block"
                        )}
                    >
                        Terms of Use
                    </Link>
                </div>
            </div>
        </footer>
    );
}
const useFooterStyles = makeStyles(() => ({
    termOdUseStyle: {
        "@media (max-width: 600px)": {
            marginTop: 8,
        },
    },
}));
