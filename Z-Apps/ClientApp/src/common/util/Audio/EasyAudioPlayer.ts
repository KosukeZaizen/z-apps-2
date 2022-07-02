/**
 * インスタンス化時点ではロードしない。
 * loadメソッドを呼び出したタイミングで明示的にロードすることもできる。
 * 事前にロードしなくても、playを呼べば再生前にロードも一緒に行われるが、
 * 再生のタイミングが少し遅れる。
 *
 * 一気に大量の音声をロードしようとすると、iOSで音声再生出来なくなる事象あり。
 * （sleepAsyncやsetTimeoutで時間差ロードしても上手くいかず。）
 * そのため、一気に複数ファイルをロードするというよりは、個別の音声ごとに、
 * 再生前の適切なイベントを見繕ってロードしておくのが良さそう。
 *
 * 音声が沢山ある場合は、全ての音声に対してあらかじめインスタンス化はしておいて、
 * 別のトリガーで、個別の音声ごとにロードしておく。
 */
export class EasyAudioPlayer extends Audio {
    constructor(private path: string) {
        super();
    }

    load = () => {
        if (this.src !== this.path) {
            this.src = this.path; // set src here because loading is stated automatically when src is set
            super.load();
        }
    };

    // enable to wait until the end of the sound
    play = () =>
        new Promise<void>((resolve, reject) => {
            try {
                this.load(); // load if it's still not loaded
                this.onended = () => {
                    resolve();
                };
                super.play();
            } catch (err) {
                reject(err);
            }
        });
}

