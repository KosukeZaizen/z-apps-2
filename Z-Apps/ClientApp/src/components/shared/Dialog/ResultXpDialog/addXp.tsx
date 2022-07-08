import { getAppState } from "../../../../common/appState";
import { addGuestXp } from "./GuestUser";
import { addRegisteredUserXp } from "./RegisteredUser";
import { AddXpParams } from "./types";

export async function addXp(dialogState: AddXpParams) {
    const user = getAppState().user;
    if (user) {
        // already logged in
        await addRegisteredUserXp(dialogState, user);
        return;
    }
    // still not logged in
    await addGuestXp(dialogState);
}
