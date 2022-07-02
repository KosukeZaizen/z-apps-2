import * as React from "react";
import { appsPublicImg, BLOG_URL } from "../../../../../common/consts";
import { ATargetBlank } from "../../../../shared/Link/ATargetBlank";

const logo = appsPublicImg + "game-logo-1.png";

export default class Page1 extends React.Component<any, any> {
    consts: { BTN_START_CLASS: string };

    constructor(props: any) {
        super(props);
        this.consts = {
            BTN_START_CLASS: "btn btn-dark btn-lg btn-block",
        };
        this.state = {
            topImage: true,
        };
    }

    hideTopImage() {
        this.setState({ topImage: false });
    }

    render() {
        const bottomMargin = {
            marginBottom: 10,
        };
        const screenHeight = window.innerHeight;
        return (
            <div id="page1">
                <span
                    onClick={() => {
                        this.hideTopImage();
                    }}
                >
                    <TopImage topImage={this.state.topImage} />
                </span>
                <h2 style={{ color: "white" }}>
                    Which language do you prefer?
                </h2>
                {screenHeight > 360 ? (
                    <span>
                        <span
                            onClick={() => {
                                this.props.changePage(2, "English");
                            }}
                        >
                            <button
                                style={bottomMargin}
                                className={this.consts.BTN_START_CLASS}
                            >
                                {"English"}
                            </button>
                        </span>
                        <span
                            onClick={() => {
                                this.props.changePage(2, "Japanese");
                            }}
                        >
                            <button className={this.consts.BTN_START_CLASS}>
                                {"日本語"}
                            </button>
                        </span>
                    </span>
                ) : (
                    <span>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td align="center">
                                        <span
                                            onClick={() => {
                                                this.props.changePage(
                                                    2,
                                                    "English"
                                                );
                                            }}
                                        >
                                            <button
                                                style={{ width: "80%" }}
                                                className={
                                                    this.consts.BTN_START_CLASS
                                                }
                                            >
                                                {"English"}
                                            </button>
                                        </span>
                                    </td>
                                    <td align="center">
                                        <span
                                            onClick={() => {
                                                this.props.changePage(
                                                    2,
                                                    "Japanese"
                                                );
                                            }}
                                        >
                                            <button
                                                style={{ width: "80%" }}
                                                className={
                                                    this.consts.BTN_START_CLASS
                                                }
                                            >
                                                {"日本語"}
                                            </button>
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </span>
                )}
                <br />
                <div className="center" style={{ color: "white" }}>
                    If you want to be a real Ninja, please check this:
                    <br />
                    <ATargetBlank
                        href={`${BLOG_URL}/2018/09/how-to-be-ninja.html`}
                    >
                        {"How to be a Ninja >>"}
                    </ATargetBlank>
                </div>
                <br />
                <br />
            </div>
        );
    }
}

function TopImage(props: any) {
    if (props.topImage) {
        return (
            <h1>
                <img
                    width="100%"
                    src={logo}
                    alt="Lingual Ninja Games - Scrolls of The Four Elements"
                />
            </h1>
        );
    } else {
        return <span></span>;
    }
}

export { Page1 };
