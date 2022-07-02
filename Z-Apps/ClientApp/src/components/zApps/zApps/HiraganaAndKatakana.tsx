import { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import { useScreenSize } from "../../../common/hooks/useScreenSize";
import { ColorChangeButton } from "../../shared/Animations/ColorChangeButton";
import { SeasonAnimation } from "../../shared/Animations/SeasonAnimation";
import { AuthorArea } from "../../shared/Author";
import CharacterComment from "../../shared/CharacterComment";
import FB from "../../shared/FaceBook";
import { FolktaleMenu } from "../../shared/FolktaleMenu";
import Helmet from "../../shared/Helmet";
import { Link } from "../../shared/Link/LinkWithYouTube";
import { ScrollBox } from "../../shared/ScrollBox";
import { getKanaPercentage } from "./parts/KanaQuiz/kanaProgress";
import "./parts/KanaQuiz/KanaQuiz.css";

const getImgNumber = () => {
    const today = new Date();
    const todayNumber = today.getMonth() + today.getDate();
    const mod = todayNumber % 27;
    if (mod > 20) return 1;
    if (mod > 8) return 2;
    return 3;
};
const imgNumber = getImgNumber();

function HiraganaAndKatakana() {
    const [hiraganaPercentage, setHiraganaPercentage] = useState(0);
    const [katakanaPercentage, setKatakanaPercentage] = useState(0);
    useEffect(() => {
        setHiraganaPercentage(getKanaPercentage("Hiragana"));
        setKatakanaPercentage(getKanaPercentage("Katakana"));
    }, []);

    const { screenWidth } = useScreenSize();
    const buttonWidth = screenWidth < 400 ? "80%" : undefined;

    return (
        <div className="kana-quiz center">
            <Helmet
                title="Hiragana / Katakana Quiz"
                desc="Free web app to remember Japanese Hiragana and Katakana characters! Try to get a perfect score on all the quizzes!"
            />
            <div style={{ maxWidth: "700px" }}>
                <BreadCrumbs />
                <h1
                    id="h1title"
                    style={{
                        margin: "25px",
                        lineHeight: "45px",
                        fontWeight: "bold",
                    }}
                    className="whiteShadow"
                >
                    {"Hiragana and Katakana Quiz"}
                </h1>
                <br />
                <CharacterComment
                    imgNumber={imgNumber}
                    screenWidth={screenWidth}
                    comment={
                        <div
                            style={{
                                textAlign: "left",
                                padding: "0 8px",
                            }}
                        >
                            Free web app to remember Japanese Hiragana and
                            Katakana characters!
                            <br />
                            Try to get a perfect score on all the quizzes!
                        </div>
                    }
                />

                <ScrollBox hoverScale>
                    <h2>Hiragana</h2>
                    <div
                        style={{
                            margin: "20px 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <div style={{ textAlign: "left" }}>
                            Hiragana is the most basic character in the Japanese
                            language!
                            <br />
                            Let's test your memory of Hiragana!
                        </div>
                    </div>
                    <div style={{ fontSize: "x-large", marginBottom: 25 }}>
                        {"Your progress:"}
                        <wbr />
                        <Link
                            to="/hiragana-quiz#Hiragana-chart"
                            style={{ fontWeight: "bold", paddingLeft: 7 }}
                        >
                            {hiraganaPercentage}%
                        </Link>
                    </div>
                    <Link to="/hiragana-quiz">
                        <ColorChangeButton
                            style={{ margin: 5, width: buttonWidth }}
                            initialColor="primary"
                            label="Hiragana Quiz"
                        />
                    </Link>
                    <Link to="/hiragana-quiz#Hiragana-chart">
                        <Button
                            style={{
                                margin: 5,
                                width: buttonWidth,
                            }}
                            color="secondary"
                        >
                            Hiragana Chart
                        </Button>
                    </Link>
                </ScrollBox>

                <ScrollBox style={{ marginTop: 45 }} hoverScale>
                    <h2>Katakana</h2>
                    <div
                        style={{
                            margin: "20px 0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <div style={{ textAlign: "left" }}>
                            Katakana is similar to Hiragana!
                            <br />
                            Try to get a perfect score!
                        </div>
                    </div>
                    <div style={{ fontSize: "x-large", marginBottom: 25 }}>
                        {"Your progress:"}
                        <wbr />
                        <Link
                            to="/katakana-quiz#Katakana-chart"
                            style={{ fontWeight: "bold", paddingLeft: 7 }}
                        >
                            {katakanaPercentage}%
                        </Link>
                    </div>
                    <Link to="/katakana-quiz">
                        <ColorChangeButton
                            style={{ margin: 5, width: buttonWidth }}
                            initialColor="success"
                            label="Katakana Quiz"
                        />
                    </Link>
                    <Link to="/katakana-quiz#Katakana-chart">
                        <Button
                            style={{ margin: 5, width: buttonWidth }}
                            color="secondary"
                        >
                            Katakana Chart
                        </Button>
                    </Link>
                </ScrollBox>
                <hr />

                <Link to="/vocabulary-quiz">
                    <button className="btn btn-dark btn-lg btn-block">
                        {"Japanese Vocabulary Quiz"}
                    </button>
                </Link>
                <hr />
                <FolktaleMenu screenWidth={screenWidth} />
                <AuthorArea
                    title="Developer"
                    screenWidth={Math.min(screenWidth, 600)}
                    style={{ marginTop: 50 }}
                    hoverScale
                />
            </div>
            <br />
            <FB />
            <br />
            <SeasonAnimation frequencySec={2} screenWidth={screenWidth} />
        </div>
    );
}

function BreadCrumbs() {
    return (
        <div
            className="breadcrumbs"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            style={{ textAlign: "left" }}
        >
            <span
                itemProp="itemListElement"
                itemScope
                itemType="http://schema.org/ListItem"
            >
                <Link
                    to="/"
                    itemProp="item"
                    style={{
                        marginRight: "5px",
                        marginLeft: "5px",
                    }}
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
                <span
                    itemProp="name"
                    style={{
                        marginRight: "5px",
                        marginLeft: "5px",
                    }}
                >
                    {"Hiragana and Katakana"}
                </span>
                <meta itemProp="position" content="2" />
            </span>
        </div>
    );
}

export default HiraganaAndKatakana;
