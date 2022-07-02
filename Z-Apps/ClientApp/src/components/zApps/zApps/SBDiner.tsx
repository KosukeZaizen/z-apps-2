import * as React from "react";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { EmptyObject } from "redux";
import { BLOB_URL } from "../../../common/consts";
import { setNoYouTubeAdMode } from "../../../common/util/setNoYouTubeAdMode";
import Head from "../../shared/Helmet";
import { ATargetBlank } from "../../shared/Link/ATargetBlank";

type ImgType = "top1" | "top2" | "burger_menu" | "drink_menu";

type State = Partial<{
    top2: File;
    top1: { file: File; order: number }[];
    burger_menu: { file: File; order: number }[];
    drink_menu: { file: File; order: number }[];
    pw: string;
    isUploading: boolean;
}>;

export default class SBDiner extends React.Component<EmptyObject, State> {
    constructor(props: EmptyObject) {
        super(props);

        //セーブデータがあればそれを設定
        const saveData = localStorage.getItem("sb-diner-token");
        const objSaveData = saveData && JSON.parse(saveData);

        let token;
        if (objSaveData) {
            token = objSaveData.token || "";
        } else {
            token = "";
        }

        this.state = {
            top1: [],
            burger_menu: [],
            drink_menu: [],
            top2: undefined,
            pw: token,
            isUploading: false,
        };

        // disable YouTube ad
        setNoYouTubeAdMode();
    }

    handleChangeFile = (
        e: React.ChangeEvent<HTMLInputElement>,
        imageType: ImgType,
        multipleFiles?: boolean
    ) => {
        const target = e.target;
        const file = target.files?.item(0);

        if (multipleFiles) {
            if (!target.files) return;

            const fileArray = Array.from(target.files);
            if (
                fileArray.some(
                    file => !file.name.toLowerCase().endsWith(".png")
                )
            ) {
                alert("画像の拡張子はpngでお願いします！");
                return;
            }

            this.setState({
                [imageType]: fileArray.map((file, order) => ({
                    file,
                    order,
                })),
            });
            return;
        }

        // Single file
        if (file && !file.name.toLowerCase().endsWith(".png")) {
            alert("画像の拡張子はpngでお願いします！");
            return;
        }
        this.setState({ [imageType]: file || undefined });
    };

    handleChangePW = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ pw: e.target.value });
        localStorage.setItem(
            "sb-diner-token",
            JSON.stringify({ token: e.target.value })
        );
    };

    uploadFile = (imageType: string) => {
        this.setState({ isUploading: true });

        let file = null;
        if (imageType === "top2") {
            file = this.state.top2;
        }

        if (!file || file.name.split(".").pop()?.toLowerCase() !== "png") {
            alert("Error! Please select a png file.");
            this.setState({ isUploading: false });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("shop", "sb-diner");
        formData.append("fileName", imageType);
        formData.append("pw", this.state.pw || "");

        fetch("/api/ShopImg/Upload", { method: "POST", body: formData })
            .then(async response => {
                const result = await response.json();
                if (result) {
                    if (result.errMessage) {
                        alert(result.errMessage);
                    } else {
                        alert(
                            "スマホ用サブ画像のアップロードに成功しました！\n\nS.B Dinerのサイトを開きます。画像が変更されていない場合は、ブラウザのリロードを行ってみてください。\nなお、こちらはスマホ用のサブ画像なので、スマホでしか表示されません。"
                        );
                        window.open("https://www.sb-diner.com/");

                        // @ts-ignore
                        window.location.reload(true);
                    }
                } else {
                    alert("Failed to upload... Status:" + response.status);
                }
                this.setState({ isUploading: false });
            })
            .catch(() => {
                alert("Failed to upload...");
                this.setState({ isUploading: false });
            });
    };

    uploadMultipleFiles = async (
        imgType: "top1" | "burger_menu" | "drink_menu",
        urlToOpen?: string
    ) => {
        this.setState({ isUploading: true });

        if (
            !window.confirm(
                "新しいトップ画像をアップロードすると、古いファイルは削除されます。よろしいですか？"
            )
        ) {
            this.setState({ isUploading: false });
            return;
        }

        const img = this.state[imgType];
        if (!img) {
            return;
        }
        const files = [...img]
            .sort((a, b) => a.order - b.order)
            .map(m => m.file);

        for (let file of files) {
            if (!file || file.name.split(".").pop()?.toLowerCase() !== "png") {
                alert("png形式でお願いします！");
                this.setState({ isUploading: false });
                return;
            }
        }

        //古いTop1画像をストレージから削除
        const formData = new FormData();
        formData.append("shop", "sb-diner");
        formData.append("pw", this.state.pw || "");
        formData.append("type", imgType);
        const error = await this.sendPost(
            formData,
            "/api/ShopImg/DeleteOldMenu"
        );
        if (error) {
            alert(error);
            this.setState({ isUploading: false });
            return;
        }

        for (let i in files) {
            //１ファイルずつアップロード
            const formData = new FormData();
            formData.append("file", files[i]);
            formData.append("shop", "sb-diner");
            formData.append(
                "fileName",
                `${imgType}/sb-diner-${imgType}-${(
                    "00" +
                    (Number(i) + 1)
                ).slice(-2)}`
            );
            formData.append("pw", this.state.pw || "");

            const error = await this.sendPost(formData, "/api/ShopImg/Upload");
            if (error) {
                alert(error);
                this.setState({ isUploading: false });
                return;
            }
        }

        this.setState({ isUploading: false });
        alert(
            "トップ画像のアップロードに成功しました！\n\nS.B Dinerのサイトを開きます。画像が変更されていない場合は、ブラウザのリロードを行ってみてください。"
        );
        window.open(urlToOpen || "https://www.sb-diner.com/");
    };

    sendPost = async (formData: FormData, url: string): Promise<string> => {
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result) {
                if (result.errMessage) {
                    return result.errMessage;
                } else {
                    //成功
                    return "";
                }
            } else {
                return "アップロード失敗... ステータス:" + response.status;
            }
        } catch (e) {
            console.log(e);
            return "アップロードに失敗しました";
        }
    };

    render() {
        const { top1, burger_menu, drink_menu, isUploading } = this.state;

        const createObjectURL: (file: File) => string =
            (window.URL || window.webkitURL).createObjectURL ||
            (
                window as typeof window & {
                    createObjectURL: (file: File) => string;
                }
            ).createObjectURL;

        return (
            <div>
                <Head title={"S.B. Diner - 画像アップロード"} noindex />
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#1b181b",
                        position: "fixed",
                        top: 0,
                        right: 0,
                        zIndex: -1,
                    }}
                ></div>
                <div style={{ maxWidth: 1000, color: "white" }}>
                    <h1
                        style={{
                            margin: "30px 0",
                            lineHeight: "30px",
                            color: "#eb6905",
                            fontWeight: "bold",
                        }}
                    >
                        S.B. Diner 画像 Uploader
                    </h1>
                    <br />
                    航介から連絡されたパスワード入力欄：
                    <br />
                    <input
                        type="text"
                        onChange={this.handleChangePW}
                        value={this.state.pw}
                        style={{ color: "black" }}
                    />
                    <br />
                    （パスワード紛失したら連絡下さい）
                    <br />
                    <br />
                    <MultipleImagesField
                        h2Title="トップ画像"
                        imgType={"top1"}
                        files={top1 || []}
                        createObjectURL={createObjectURL}
                        isUploading={isUploading}
                        setState={(state: State) => {
                            this.setState(state);
                        }}
                        uploadMultipleFiles={() =>
                            this.uploadMultipleFiles("top1")
                        }
                        handleChangeFile={e =>
                            this.handleChangeFile(e, "top1", true)
                        }
                        explanation={
                            <>
                                PC、スマホ共にトップに表示される画像です。
                                <br />
                                複数の画像を設定頂くと、一定時間で緩やかに画像が切り替わります。
                                <br />
                                以下のボタンから、掲載したい全ての画像を、一度に選択してください。（一度に複数のファイルを選択可能です。）
                            </>
                        }
                    />
                    <div
                        style={{
                            padding: "10px",
                            marginBottom: "10px",
                            border: "5px double #333333",
                            color: "#eb6905",
                        }}
                    >
                        <h2>スマホ用サブ画像</h2>
                        <br />
                        スマホでサイトを開いた時に、トップ画像の下部に表示されるサブの画像です。
                        <br />
                        <br />
                        現在の画像:
                        <br />
                        <img
                            src={`${BLOB_URL}/sb-diner/top2.png`}
                            style={{ width: "100%" }}
                            alt="s.b. diner top2"
                        />
                        <br />
                        <br />
                        png形式のファイルのみアップロード可能です。
                        <br />
                        jpgなどから変換する必要がある場合は、「
                        <ATargetBlank href="https://jpg2png.com/ja/">
                            JPG to PNG
                        </ATargetBlank>
                        」のようなサイトを利用すると便利だと思います。
                        <br />
                        <br />
                        <input
                            type="file"
                            name="top2"
                            onChange={e => this.handleChangeFile(e, "top2")}
                        />
                        <br />
                        <br />
                        {this.state.top2 && (
                            <button
                                style={{
                                    marginTop: 10,
                                    marginBottom: 10,
                                    fontWeight: "bold",
                                    cursor: isUploading
                                        ? "not-allowed"
                                        : undefined,
                                }}
                                className="btn btn-primary btn-lg"
                                onClick={() => this.uploadFile("top2")}
                                disabled={isUploading}
                            >
                                {isUploading
                                    ? "アップロード中…"
                                    : "アップロード実行"}
                            </button>
                        )}
                    </div>
                    <MultipleImagesField
                        h2Title="ハンバーガーメニュー"
                        imgType={"burger_menu"}
                        files={burger_menu || []}
                        createObjectURL={createObjectURL}
                        isUploading={isUploading}
                        setState={(state: State) => {
                            this.setState(state);
                        }}
                        uploadMultipleFiles={() =>
                            this.uploadMultipleFiles(
                                "burger_menu",
                                "https://www.sb-diner.com/p/burger-menu.html"
                            )
                        }
                        handleChangeFile={e =>
                            this.handleChangeFile(e, "burger_menu", true)
                        }
                        explanation={
                            <>
                                「BURGER MENU」ページに表示される画像です。
                                <br />
                                以下のボタンから、掲載したい全ての画像を、一度に選択してください。（一度に複数のファイルを選択可能です。）
                            </>
                        }
                    />
                    <MultipleImagesField
                        h2Title="ドリンクメニュー"
                        imgType={"drink_menu"}
                        files={drink_menu || []}
                        createObjectURL={createObjectURL}
                        isUploading={isUploading}
                        setState={(state: State) => {
                            this.setState(state);
                        }}
                        uploadMultipleFiles={() =>
                            this.uploadMultipleFiles(
                                "drink_menu",
                                "https://www.sb-diner.com/p/drink-menu.html"
                            )
                        }
                        handleChangeFile={e =>
                            this.handleChangeFile(e, "drink_menu", true)
                        }
                        explanation={
                            <>
                                「DRINK MENU」ページに表示される画像です。
                                <br />
                                以下のボタンから、掲載したい全ての画像を、一度に選択してください。（一度に複数のファイルを選択可能です。）
                            </>
                        }
                    />
                </div>
            </div>
        );
    }
}

function MultipleImagesField({
    h2Title,
    imgType,
    files,
    createObjectURL,
    isUploading,
    setState,
    uploadMultipleFiles,
    handleChangeFile,
    explanation,
}: {
    h2Title: string;
    imgType: ImgType;
    files: { file: File; order: number }[];
    createObjectURL: (file: File) => string;
    isUploading?: boolean;
    setState: (state: State) => void;
    uploadMultipleFiles: () => void;
    handleChangeFile: (ev: ChangeEvent<HTMLInputElement>) => void;
    explanation: ReactNode;
}) {
    return (
        <div
            style={{
                padding: "10px",
                marginBottom: "10px",
                border: "5px double #333333",
                color: "#eb6905",
            }}
        >
            <h2>{h2Title}</h2>
            {files
                .sort((a, b) => a.order - b.order)
                .filter(m => m.file instanceof File)
                .map((m, i) => (
                    <div
                        key={`${m.order}-${i}`}
                        style={{
                            width: "30%",
                            margin: "20px 5px 5px",
                            display: "inline-block",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                marginBottom: 2,
                            }}
                        >
                            <span>表示順：</span>
                            <input
                                type="number"
                                style={{
                                    width: "50%",
                                    marginRight: "auto",
                                    textAlign: "right",
                                    color: "black",
                                }}
                                defaultValue={`${m.order + 1}`}
                                onBlur={e => {
                                    setState({
                                        [imgType]: [
                                            ...files.filter(
                                                me => me.file !== m.file
                                            ),
                                            {
                                                file: m.file,
                                                order:
                                                    Number(e.target.value) - 1,
                                            },
                                        ],
                                    });
                                }}
                            />
                        </div>
                        <img
                            alt={`img${i}`}
                            style={{ width: "100%" }}
                            src={createObjectURL(m.file)}
                        />
                    </div>
                ))}
            <br />
            {files.length > 0 ? (
                <span>
                    上記の「表示順」の値が小さいファイルから順番にサイトに表示されます。
                    <br />
                    「表示順」の値を変更して、適切な順番に並び替えてください。
                    <br />
                    （「表示順」の数値は連続してなくてもOKっす）
                    <br />
                    <br />
                    <button
                        style={{ color: "black" }}
                        onClick={() => setState({ [imgType]: [] })}
                    >
                        クリア（ファイルを選びなおす）
                    </button>
                    <br />
                    <br />
                    <button
                        style={{
                            marginTop: 10,
                            marginBottom: 10,
                            fontWeight: "bold",
                            cursor: isUploading ? "not-allowed" : undefined,
                        }}
                        className="btn btn-primary btn-lg"
                        onClick={uploadMultipleFiles}
                        disabled={isUploading}
                    >
                        {isUploading ? "アップロード中…" : "アップロード実行"}
                    </button>
                </span>
            ) : (
                <span>
                    {explanation}
                    <br />
                    <br />
                    現在の画像：
                    <br />
                    <MultipleImagesPreview imgType={imgType} />
                    <br />
                    png形式のファイルのみアップロード可能です。
                    <br />
                    jpgなどから変換する必要がある場合は、「
                    <ATargetBlank href="https://jpg2png.com/ja/">
                        JPG to PNG
                    </ATargetBlank>
                    」のようなサイトを利用すると便利だと思います。
                    <br />
                    <br />
                    <input
                        type="file"
                        name={imgType}
                        onChange={handleChangeFile}
                        multiple
                    />
                </span>
            )}
            <br />
        </div>
    );
}

function MultipleImagesPreview({ imgType }: { imgType: ImgType }) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    useEffect(() => {
        (async () => {
            setImages(await getTopPreviewImages(imgType));
        })();
    }, [imgType]);

    return (
        <div>
            {images.map(image => (
                <img
                    key={image.src}
                    src={image.src}
                    style={{
                        width: "100%",
                        maxWidth: 300,
                        marginRight: 5,
                        marginBottom: 5,
                    }}
                />
            ))}
        </div>
    );
}

async function getTopPreviewImages(
    imgType: ImgType
): Promise<HTMLImageElement[]> {
    const images: HTMLImageElement[] = [];
    let hasMoreImages = true;
    let i = 0;
    while (hasMoreImages) {
        i++;
        const imgId = ("00" + i).slice(-2);
        const imgUrl = `https://lingualninja.blob.core.windows.net/lingual-storage/sb-diner/${imgType}/sb-diner-${imgType}-${imgId}.png`;

        const newImage = new Image();

        const image = await new Promise<HTMLImageElement | null>(
            (resolve, reject) => {
                try {
                    newImage.onload = function () {
                        const img = document.createElement("img");
                        img.src = imgUrl;

                        resolve(img);
                    };

                    newImage.onerror = function () {
                        hasMoreImages = false;

                        resolve(null);
                    };

                    newImage.src = imgUrl;
                } catch (e) {
                    console.log("e", e);
                    reject(e);
                }
            }
        );
        if (image) {
            images.push(image);
        }
    }
    return images;
}
