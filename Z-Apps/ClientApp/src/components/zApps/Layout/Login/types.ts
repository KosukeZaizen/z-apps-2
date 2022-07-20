import { MyPageTopPanelState } from "./MyPage/MyPageTop/types";

export type SignInPanelState =
    | { type: "signIn" }
    | { type: "signUp" }
    | MyPageTopPanelState
    | { type: "close" };
