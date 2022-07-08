import { ReactNode } from "react";

export type AddXpParams = {
    onCloseCallBack?: () => void;
    xpToAdd: number;
    topSmallMessage: ReactNode;
    abTestName: string;
};

export type RegisteredUserXpDialogState =
    | {
          onCloseCallBack?: () => void;
          xpToAdd: number;
          topSmallMessage: ReactNode;
          isLevelUp?: boolean;
      }
    | "close";

export type GuestUserXpDialogState =
    | {
          onCloseCallBack?: () => void;
          xpToAdd: number;
          topSmallMessage: ReactNode;
          abTestName: string;
          previousLevel?: number;
          expectedLevel?: number;
      }
    | "close";
