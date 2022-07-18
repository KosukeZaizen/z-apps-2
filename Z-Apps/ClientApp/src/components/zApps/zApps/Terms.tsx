import "../../../css/Terms.css";
import { AuthorName } from "../../shared/Author/Author";
import Helmet from "../../shared/Helmet";

export default function Terms() {
    return (
        <div className="terms">
            <Helmet
                title="Terms of Use"
                desc="Lingual Ninja - The ownership of website and Responsibility"
            />
            <div className="center">
                <h1 style={{ lineHeight: 1.2 }}>
                    <span style={{ whiteSpace: "nowrap" }}>Lingual Ninja</span>{" "}
                    <span style={{ whiteSpace: "nowrap" }}>Terms of Use</span>
                </h1>
                <div className="contents">
                    <hr />
                    <h2>The ownership of website</h2>
                    <p>
                        This website is developed and owned by{" "}
                        <AuthorName title="Developer" />. When you want to use
                        any quotes, images, or programs, you must get approval
                        from the owner.
                    </p>
                    <hr />
                    <h2>Responsibility</h2>
                    <p>
                        If user experiences trouble including defects or bugs,
                        the owner of this website can't be held liable. It will
                        be user's responsibility.
                    </p>
                </div>
            </div>
        </div>
    );
}
