import { Location } from "history";
import { useHashScroll } from "../../../common/hooks/useHashScroll";
import FB from "../../shared/FaceBook";
import Helmet from "../../shared/Helmet";
import { Link } from "../../shared/Link/LinkWithYouTube";
import { hiraganaList } from "./parts/KanaQuiz/kanaProgress";
import "./parts/KanaQuiz/KanaQuiz.css";
import { QuizCore } from "./parts/KanaQuiz/KanaQuizCore";
import { KanaQuizConsts } from "./parts/KanaQuiz/types";

function HiraganaQuiz({ location }: { location: Location }) {
    useHashScroll(location);

    return (
        <div className="kana-quiz center">
            <Helmet
                title="Hiragana Quiz"
                desc="A web app to remember Hiragana! I hope this will help you to study!"
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
            <br />
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
                    {"Hiragana Quiz"}
                </span>
                <meta itemProp="position" content="3" />
            </span>
        </div>
    );
}

export default HiraganaQuiz;

export const consts: KanaQuizConsts = {
    KANA_TYPE: "Hiragana",
    OTHER_KANA_TYPE: "Katakana",
    KANA_LIST: hiraganaList,
    MARK_DOWN: `
## What is Hiragana?
Japanese language has three types of characters.
The three are Hiragana, Katakana, and Kanji.
Hiragana is the most basic character in Japanese.
This is the first step for learning Japanese!

## How to use Hiragana Quiz
There are three options implemented in this app.
"Random 10 characters", "Random 30 characters", and “All Hiragana characters”.

### Random 10 characters mode
Please try this option first.
10 Hiragana characters will be shown randomly, and you will choose how to pronounce them with Romaji.
After starting the quiz, one Hiragana character will appear on the top of the screen, and below it, you will see 4 options where Romaji characters are written.
You can choose the correct pronunciation of the Hiragana character from the 4 options.

Even if you make a mistake, don’t worry because there will be only 10 questions in this mode.
After you finish all 10 questions, you can check your score.
Also, you can check the list of Hiragana characters in which you didn’t choose the correct answer.
Please remember the Hiragana characters in which you didn’t choose the correct option.
After remembering, please try again!

### Random 30 characters mode
If you can pass the “Random 10 characters mode”, please try “Random 30 characters mode”.
Since you have already gotten use to this app, you can probably proceed with this quiz smoothly.
If you make mistakes, please remember them after the quiz.
The list of the Hiragana characters that you didn’t pass will be shown at the end of the quiz in this mode as well.

### All Hiragana characters mode
If you got a perfect score in the other two modes, please try “All Hiragana characters mode”!
This quiz may be long because there are 104 questions included in this mode.
Even if it’s hard, don’t give up because when you get a perfect score, you will be a Hiragana master!

## The next step after taking this Hiragana Quiz
After you get a perfect score in “All Hiragana characters mode”, the next step is remembering Katakana.
Since you already remembered all of the Hiragana characters using this Hiragana Quiz, remembering the Katakana characters will be quite easy for you.
Many Katakana characters look like Hiragana characters.
So, the knowledge you obtained from the Hiragana Quiz will be useful.
Please proceed to the next step by clicking the “Katakana Quiz” button below!`,
} as const;
