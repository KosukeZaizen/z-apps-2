import { changeAppState } from "../../../../../common/appState";
import { User } from "../../../../../common/hooks/useUser";
import { mergeLocalStorageAndSavedUserData } from "./progressManager";

export async function loginSuccess(user: User) {
    await mergeLocalStorageAndSavedUserData(user);
    changeAppState("signInPanelState", "myPageTop");
}
