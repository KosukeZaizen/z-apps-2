import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { makeStyles, Theme } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { ReactNode, SyntheticEvent, useState } from "react";
import { changeAppState } from "../../../../common/appState";
import { useScreenSize } from "../../../../common/hooks/useScreenSize";
import { User } from "../../../../common/hooks/useUser";
import { FetchResult } from "../../../../types/fetch";
import ShurikenProgress from "../../../shared/Animations/ShurikenProgress";
import { TextField } from "../../../shared/Input/TextField";
import { loginSuccess } from "./MyPage/loginSuccess";
import { PasswordField, useOpenState, useStyles } from "./SignUp/SignUp";

export function SignIn({
    chosen,
    panelClosed,
    email,
    password,
    setEmail,
    setPassword,
}: {
    chosen: boolean;
    panelClosed: boolean;
    email: string;
    password: string;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
}) {
    const classes = useStyles();
    const { screenWidth } = useScreenSize();
    const [submissionError, setSubmissionError] = useState<ReactNode>(null);
    const [rememberMe, setRememberMe] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const { partiallyOpened, completelyOpened } = useOpenState(chosen);
    const containerC = useContainerStyles({
        panelClosed,
        completelyOpened,
        chosen,
        sidePadding: screenWidth > 600 ? 25 : 15,
    });
    if (!partiallyOpened) {
        return null;
    }

    const onSubmit = async (ev: SyntheticEvent) => {
        ev.preventDefault();

        setSubmitting(true);
        const res = await fetch("api/Auth/Login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password,
                rememberMe,
            }),
        });
        const result: FetchResult<User> = await res.json();

        if (!("error" in result)) {
            await loginSuccess(result);
            setSubmitting(false);
            return;
        }

        setSubmissionError(getSubmissionError(result.error));
        setSubmitting(false);
    };

    return (
        <Container
            component="div"
            className={containerC.container}
            key="signIn"
        >
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <h2 className={classes.bold}>Sign in</h2>

                {submissionError && (
                    <div className={classes.errorContainer}>
                        {submissionError}
                    </div>
                )}

                <form className={classes.form} onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        autoComplete="email"
                        onChange={ev => {
                            setEmail(ev.target.value);
                            setSubmissionError(null);
                        }}
                        value={email}
                    />
                    <PasswordField
                        onChange={ev => {
                            setPassword(ev.target.value);
                            setSubmissionError(null);
                        }}
                        password={password}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                color="primary"
                                onChange={() => {
                                    setRememberMe(!rememberMe);
                                }}
                            />
                        }
                        label="Remember me"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ShurikenProgress size="7%" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    <Grid container>
                        <Grid item xs>
                            {/* <a
                                href="#"
                                onClick={ev => {
                                    ev.preventDefault();
                                }}
                            >
                                Forgot password?
                            </a> */}
                        </Grid>
                        <Grid item>
                            <a
                                href="#"
                                onClick={ev => {
                                    ev.preventDefault();
                                    changeAppState("signInPanelState", {
                                        type: "signUp",
                                    });
                                }}
                            >
                                {"Don't have an account? Sign Up"}
                            </a>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}
const useContainerStyles = makeStyles<
    Theme,
    {
        panelClosed: boolean;
        completelyOpened: boolean;
        chosen: boolean;
        sidePadding: number;
    }
>({
    container: ({ panelClosed, completelyOpened, chosen, sidePadding }) => ({
        position: "absolute",
        right: panelClosed || completelyOpened ? 0 : chosen ? 600 : -600,
        transition: "all 500ms",
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
    }),
});

function getSubmissionError(error: string): ReactNode {
    if (error === "emailNoMatch") {
        return (
            <span>
                Sorry, we can't find an account with this email address.
                <br />
                Please try again or{" "}
                <a
                    href="#"
                    onClick={ev => {
                        ev.preventDefault();
                        changeAppState("signInPanelState", { type: "signUp" });
                    }}
                >
                    create a new account
                </a>
                .
            </span>
        );
    }
    if (error === "passwordNoMatch") {
        return "Incorrect password."; // + "Please try again or you can reset your password.";
    }
    return error;
}
