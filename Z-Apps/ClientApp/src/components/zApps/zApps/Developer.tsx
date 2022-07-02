import * as React from "react";
import { appsPublicImg } from "../../../common/consts";
import { css } from "../../../common/util/getAphroditeClassName";
import "../../../css/Developer.css";
import FB from "../../shared/FaceBook";
import Helmet from "../../shared/Helmet";
import { ATargetBlank } from "../../shared/Link/ATargetBlank";

const image = appsPublicImg + "KosukeZaizen.jpg";
function SayHello() {
    return (
        <p>
            <b>Hello! I'm Kosuke Zaizen!</b>
            <br />
            <br />
            Thank you for using Lingual Ninja!
            <br />
            I am a Japanese software engineer.
            <br />
            Lingual Ninja is a website for Japanese learners.
            <br />I hope Lingual Ninja can help!
        </p>
    );
}

export default class Developer extends React.Component {
    ref: React.RefObject<HTMLHRElement>;

    constructor(props: {}) {
        super(props);
        this.ref = React.createRef();
    }

    render() {
        return (
            <div className="developer">
                <Helmet
                    title="Kosuke Zaizen"
                    desc="I am a Japanese software engineer. Lingual Ninja is a website for Japanese learners. I hope Lingual Ninja can help!"
                />
                <div className="center">
                    <h1>Kosuke Zaizen</h1>

                    <div className="contents">
                        <hr id="scrollTargetId" />
                        <span
                            className={css({
                                "@media (max-width: 599px)": {
                                    display: "none",
                                },
                            })}
                        >
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img
                                                width="200px"
                                                src={image}
                                                alt="Kosuke Zaizen"
                                            />
                                        </td>
                                        <td
                                            className="tdExplanation"
                                            valign="top"
                                        >
                                            <SayHello />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </span>
                        <span
                            className={css({
                                "@media (min-width: 600px)": {
                                    display: "none",
                                },
                            })}
                        >
                            <div className="center">
                                <img
                                    width="200px"
                                    src={image}
                                    alt="Kosuke Zaizen"
                                />
                                <br />
                                <br />
                                <SayHello />
                            </div>
                        </span>
                        <hr ref={this.ref} />
                        <br />
                        <div className="center">
                            I am writing a blog for people studying Japanese!:
                            <br />
                            <b>
                                <ATargetBlank href="https://articles.lingual-ninja.com/articles">
                                    {"Articles about Japan >>"}
                                </ATargetBlank>
                            </b>
                            <br />
                            <br />
                            Also, this is my Japanese blog!:
                            <br />
                            <b>
                                <ATargetBlank href="https://web.lingual-ninja.com/">
                                    {"IT / Web技術 >>"}
                                </ATargetBlank>
                            </b>
                            <br />
                            <br />
                            <hr />
                            <FB />
                        </div>
                    </div>
                    {/* <PleaseScrollDown
                        criteriaRef={this.ref}
                        targetId="scrollTargetId"
                    /> */}
                </div>
            </div>
        );
    }
}
