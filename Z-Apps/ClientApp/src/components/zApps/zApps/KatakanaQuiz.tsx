import { Location } from "history";
import { BLOG_URL } from "../../../common/consts";
import { useHashScroll } from "../../../common/hooks/useHashScroll";
import FB from "../../shared/FaceBook";
import Helmet from "../../shared/Helmet";
import { Link } from "../../shared/Link/LinkWithYouTube";
import { katakanaList } from "./parts/KanaQuiz/kanaProgress";
import "./parts/KanaQuiz/KanaQuiz.css";
import { QuizCore } from "./parts/KanaQuiz/KanaQuizCore";
import { KanaQuizConsts } from "./parts/KanaQuiz/types";

function KatakanaQuiz({ location }: { location: Location }) {
    useHashScroll(location);

    return (
        <div className="kana-quiz center">
            <Helmet
                title="Katakana Quiz"
                desc="A web app to remember Katakana! I hope this will help you to study!"
            />
            <BreadCrumbs />
            <hr style={{ maxWidth: "600px" }} />
            <QuizCore consts={consts} />
            <div style={{ maxWidth: "600px" }}>
                <hr />
                <br />
                <Link to="/vocabulary-quiz">
                    <button className="btn btn-dark btn-lg btn-block">
                        {"Japanese Vocabulary Quiz"}
                    </button>
                </Link>
                <br />
                <hr />
            </div>
            <div style={{ fontSize: "x-large", margin: "20px" }}>
                <Link to="/folktales">
                    {"Learn Japanese from Japanese folktales >>"}
                </Link>
            </div>
            <br />
            <FB />
        </div>
    );
}

function BreadCrumbs() {
    return (
        <div
            className="breadcrumbs"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            style={{ textAlign: "left", maxWidth: "600px" }}
        >
            <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
            >
                <Link
                    to="/"
                    itemProp="item"
                    style={{ marginRight: "5px", marginLeft: "5px" }}
                >
                    <span itemProp="name">{"Home"}</span>
                </Link>
                <meta itemProp="position" content="1" />
            </span>
            {" > "}
            <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
            >
                <Link
                    to="/hiragana-katakana"
                    itemProp="item"
                    style={{ marginRight: "5px", marginLeft: "5px" }}
                >
                    <span itemProp="name">{"Hiragana and Katakana"}</span>
                    <meta itemProp="position" content="2" />
                </Link>
            </span>
            {" > "}
            <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
            >
                <span
                    itemProp="name"
                    style={{ marginRight: "5px", marginLeft: "5px" }}
                >
                    {"Katakana Quiz"}
                </span>
                <meta itemProp="position" content="3" />
            </span>
        </div>
    );
}

export default KatakanaQuiz;

const consts: KanaQuizConsts = {
    KANA_TYPE: "Katakana",
    OTHER_KANA_TYPE: "Hiragana",
    KANA_LIST: katakanaList,
    MARK_DOWN: `
## What is Katakana?
Japanese language has three types of characters.
The three characters are Hiragana, Katakana, and Kanji.
Hiragana is the most basic character in Japanese.
After remembering Hiragana, you should start to learn Katakana.

Katakana and Hiragana look very similar.
Basically, we use Hiragana more than Katakana.

### When do Japanese people use Katakana?
Katakana is used in the limited cases below:
- Loan-words from foreign countries
- Onomatopoeic word

We use Katakana for the two purposes above.
If you want to know more detailed information, please check this link:
 [When should we use Katakana? >>](${BLOG_URL}/2018/08/katakana-chart.html#Katakana-chart6)

## What you should do before taking this Katakana Quiz

Before remembering Katakana, you should remember Hiragana.
If you still don't remember all the Hiragana characters,
 please try this Hiragana Quiz: [Hiragana Quiz >>](/hiragana-quiz)

## How to use Katakana Quiz
How you use this Katakana Quiz is the same way you use the Hiragana Quiz.
If you have some issues when using the Katakana Quiz,
 please check the explanation in the Hiragana Quiz page:
 [Hiragana Quiz >>](/hiragana-quiz)

## The next step after taking this Katakana Quiz
After you get a perfect score in “All Katakana characters mode”,
 the next step is remembering vocabulary and practice reading and listening.

### Remembering vocabulary

This website has basic vocabulary lists and quizzes for N5 exam.
I recommend you to remember basic N5 vocabulary using this quiz:
 [Vocabulary Quiz >>](/vocabulary-quiz)

### Practice reading and listening
If you want to enjoy Japanese stories while remembering vocabulary,
 there is a good way.
This website has a reading practice tool called "[Japanese Folktales](/folktales)".
You can read Japanese folktales in Romaji, Hiragana, and Katakana.
Also, you can listen to the stories spoken by a native Japanese speaker.
Please try to get used to listening and reading Japanese:
 [Japanese Folktales >>](/folktales)

I hope this application helps you to study Japanese!
`,
} as const;
