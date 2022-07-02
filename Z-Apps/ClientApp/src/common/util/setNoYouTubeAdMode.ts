import { changeAppState } from "../appState";

export const noYouTubeAdStorageKey = "noYouTubeAd-v2";

/**
 * NoYouTubeAdモードから抜け出すには、300日間アクセスしない必要がある。
 * その間にアクセスがあると、再びNoYouTubeAdのカウントが最初からになる。
 * そのため、一度このモードに入るとそう簡単に抜け出せない。
 *
 * 現在、以下の３パターンがこのモードに入るが、どれも抜け出す必要がないため、
 * 現状問題ないと考える：
 *      １．sb-dinerやboscobelの画像設定画面を開いた人
 *      ２．#nをURLに付与してアクセスした人（就活用）
 *      ３．クローラー
 */
export function setNoYouTubeAdMode() {
    /**
     * AppStateにてisNoYouTubeAdModeを管理する。
     *
     * AppStateはブラウザリロードにより初期化されるが、
     * 300日間以内にこのモードに入った場合は、リロードの度にこの関数が呼ばれるため、
     * 毎回AppStateのisNoYouTubeAdModeもtrueになる。
     *
     * localStorageのみで管理せず、AppStateを主に使う理由は、
     * モード変更に応じて、既に表示されているコンポーネントの状態を
     * 後からでも切り替えられるようにするため。
     * */

    // no YouTube ad mode
    localStorage.setItem(noYouTubeAdStorageKey, new Date().toISOString()); // 300日以内にこれが設定されていると再びnoYouTubeAdModeになるので、一度このモードに入ると、元に戻す方法は300日間アクセスしないしかない

    changeAppState("isNoYouTubeAdMode", true);
}

export function checkPastNoYouTubeAd(): boolean {
    const savedDate = localStorage.getItem(noYouTubeAdStorageKey);
    if (savedDate) {
        const date = new Date(savedDate);
        const dif = new Date().getTime() - date.getTime();
        if (dif < 1000 * 60 * 60 * 24 * 300) {
            // Accessed within 300 days
            return true;
        }
    }
    return false;
}
