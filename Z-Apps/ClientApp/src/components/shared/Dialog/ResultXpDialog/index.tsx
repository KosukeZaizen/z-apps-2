import { getAppState } from "../../../../common/appState";
import { addGuestXp, setGuestResultDialogState } from "./GuestUser";
import { addRegisteredUserXp } from "./RegisteredUser";
import { AddXpParams, RegisteredUserXpDialogState } from "./types";

let setResultDialogState = (_state: RegisteredUserXpDialogState) => {};
const closedState = {
    onCloseCallBack: undefined,
    xpToAdd: 0,
    topSmallMessage: "",
    abTestName: "",
    isLevelUp: false,
} as const;

export async function addXp(dialogState: AddXpParams) {
    if (dialogState === "close") {
        setGuestResultDialogState(dialogState);
        return;
    }

    const user = getAppState().user;
    if (user) {
        // already logged in
        addRegisteredUserXp(dialogState, user);
        return;
    }
    // still not logged in
    addGuestXp(dialogState);
}
