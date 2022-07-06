import { Link } from "react-router-dom";
import { useIsAdmin } from "../../../../common/hooks/useIsAdmin";
import Helmet from "../../../shared/Helmet";

export default function Admin() {
    useIsAdmin();

    return (
        <div>
            <Helmet title="admin" noindex />
            <ul>
                <li>
                    <Link to="/apiCache">Api Cache</Link>
                </li>
                <li>
                    <Link to="/opeLogTable">Ope Log</Link>
                </li>
                <li>
                    <Link to="/abTestResult">AB Test Result</Link>
                </li>
                <li>
                    <Link to="/game-to-learn-japanese">Game to learn</Link>
                </li>
                <li>
                    <Link to="/vocabularyEdit">Vocab</Link>
                </li>
                <li>
                    <a href="https://articles.lingual-ninja.com/articlesEdit">
                        Article
                    </a>
                </li>
                <li>
                    <Link to="/folktalesEdit">Folktale</Link>
                </li>
                <li>
                    <Link to="/en-check">English Check</Link>
                </li>
                <li>
                    <Link to="/test">Test</Link>
                </li>
            </ul>
        </div>
    );
}
