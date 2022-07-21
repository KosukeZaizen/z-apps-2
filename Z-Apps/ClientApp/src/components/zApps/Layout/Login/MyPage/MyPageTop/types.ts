export type MyPageTopPanelState = {
    type: "myPageTop";
    initialView?: InitialView;
};

export type OpenableCardId =
    | "MyPageProgressPercentageCard"
    | "MyPageUserRankingAroundMe";

export type InitialView = OpenableCardId;
