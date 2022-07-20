export type MyPageTopPanelState = {
    type: "myPageTop";
    initialView?: InitialView;
};

export type OpenableCardId =
    | "MypageProgressPercentageCard"
    | "MypageUserRankingAroundMe";

export type InitialView = OpenableCardId;

