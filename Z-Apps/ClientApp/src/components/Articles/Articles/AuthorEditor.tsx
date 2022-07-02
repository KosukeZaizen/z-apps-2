import { Card, Input, InputLabel } from "@material-ui/core";
import * as React from "react";
import { useState } from "react";
import { Author, AuthorArea } from "../../shared/Author";

export function AuthorEditor({
    initialAuthor,
    onClose,
    token,
}: {
    initialAuthor: Author;
    onClose: () => void;
    token: string;
}) {
    const [author, setAuthor] = useState<Author>(initialAuthor);
    const [preview, setPreview] = useState<"pc" | "sp">("pc");
    const [file, setFile] = useState<File>();
    const [submitting, setSubmitting] = useState(false);

    const previewWidth = preview === "pc" ? 900 : 354;

    const save = async () => {
        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("authorId", author.authorId.toString());
            formData.append("authorName", author.authorName);
            formData.append("initialGreeting", author.initialGreeting);
            formData.append("selfIntroduction", author.selfIntroduction);
            formData.append("isAdmin", author.isAdmin.toString());
            formData.append("imgExtension", author.imgExtension);
            if (file) {
                formData.append("file", file);
            }
            formData.append("token", token);

            const res = await fetch("/api/Articles/UpdateAuthorInfo", {
                method: "POST",
                body: formData,
            });
            const result = await res.json();

            setSubmitting(false);
            return result.result;
        } catch (e) {
            setSubmitting(false);
            return "Failed to save...";
        }
    };

    return (
        <Card
            style={{
                margin: 5,
                padding: 15,
                height: "calc(100% - 15px)",
            }}
        >
            <h2>Edit Author Info</h2>
            <div style={{ display: "flex", height: "100%" }}>
                <div
                    style={{
                        width: 320,
                        height: "calc(100% - 25px)",
                        paddingRight: 10,
                        paddingBottom: 70,
                    }}
                >
                    <div
                        style={{
                            overflowY: "auto",
                            overflowX: "hidden",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <div style={{ margin: "20px 0" }}>
                            <InputLabel>{"Author Name"}</InputLabel>
                            <Input
                                type="text"
                                value={author.authorName}
                                onChange={ev => {
                                    if (ev.target.value.length > 50) {
                                        alert(
                                            "Author Name needs to be less than 50 characters!"
                                        );
                                        return;
                                    }
                                    setAuthor({
                                        ...author,
                                        authorName: ev.target.value,
                                    });
                                }}
                                style={{
                                    width: "100%",
                                }}
                            />
                        </div>
                        <div style={{ margin: "20px 0" }}>
                            <InputLabel>{"Initial Greeting"}</InputLabel>
                            <Input
                                type="text"
                                value={author.initialGreeting}
                                onChange={ev => {
                                    if (ev.target.value.length > 300) {
                                        alert(
                                            "Initial Greeting needs to be less than 300 characters!"
                                        );
                                        return;
                                    }
                                    setAuthor({
                                        ...author,
                                        initialGreeting: ev.target.value,
                                    });
                                }}
                                style={{
                                    width: "100%",
                                }}
                            />
                        </div>
                        <div style={{ margin: "20px 0" }}>
                            <InputLabel>{"Self Introduction"}</InputLabel>
                            <Input
                                type="text"
                                value={author.selfIntroduction}
                                onChange={ev => {
                                    const selfIntroduction = ev.target.value
                                        .split("#")
                                        .join("");

                                    if (selfIntroduction.length > 1000) {
                                        alert(
                                            "Self introduction needs to be less than 1000 characters!"
                                        );
                                        return;
                                    }
                                    setAuthor({
                                        ...author,
                                        selfIntroduction,
                                    });
                                }}
                                style={{
                                    width: "100%",
                                }}
                                multiline
                            />
                            <div
                                style={{
                                    margin: "20px 0",
                                    borderBottom:
                                        "solid 1px rgba(0, 0, 0, 0.42)",
                                    paddingBottom: 5,
                                }}
                            >
                                <InputLabel>{"Profile Image"}</InputLabel>
                                <input
                                    type="file"
                                    name="file"
                                    onChange={e => {
                                        const target = e.target;
                                        const file = target.files?.item(0);
                                        if (file) {
                                            setFile(file);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: "white",
                            width: "100%",
                            paddingTop: 10,
                            height: 50,
                        }}
                    >
                        <button
                            className="btn btn-primary"
                            style={{
                                height: 40,
                                marginRight: 20,
                                width: 95,
                            }}
                            onClick={async () => {
                                const confirmationResult = window.confirm(
                                    "Do you really want to save?"
                                );
                                if (!confirmationResult) {
                                    return;
                                }

                                const result = await save();
                                alert(result);

                                if (result === "success") {
                                    onClose();
                                }
                            }}
                            disabled={submitting}
                        >
                            {"Save"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            style={{ height: 40, width: 95 }}
                            onClick={onClose}
                        >
                            {"Close"}
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        marginLeft: 30,
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            position: "relative",
                            bottom: 15,
                        }}
                    >
                        <button
                            className={`btn btn-${
                                preview === "pc" ? "secondary" : "primary"
                            }`}
                            style={{
                                margin: "0 10px",
                                cursor:
                                    preview === "pc"
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                            onClick={() => {
                                setPreview("pc");
                            }}
                        >
                            PC Preview
                        </button>
                        <button
                            className={`btn btn-${
                                preview === "sp" ? "secondary" : "primary"
                            }`}
                            style={{
                                margin: "0 10px",
                                cursor:
                                    preview === "sp"
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                            onClick={() => {
                                setPreview("sp");
                            }}
                        >
                            Smartphone Preview
                        </button>
                    </div>
                    <div
                        style={{
                            height: "calc(100% - 100px)",
                            overflow: "auto",
                            width: "100%",
                        }}
                    >
                        <AuthorArea
                            style={{
                                marginTop: 45,
                                width: "100%",
                                maxWidth: previewWidth,
                            }}
                            screenWidth={previewWidth}
                            author={author}
                            filePath={file ? createObjectURL(file) : undefined}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}

const createObjectURL: (file: File) => string =
    (window.URL || window.webkitURL).createObjectURL ||
    (
        window as typeof window & {
            createObjectURL: (file: File) => string;
        }
    ).createObjectURL;
