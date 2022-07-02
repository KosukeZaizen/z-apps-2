export async function loadAudio(src: string): Promise<HTMLAudioElement | null> {
    return new Promise(resolve => {
        try {
            const audio = new Audio();
            audio.src = src;
            audio.load();
            audio.oncanplaythrough = () => {
                resolve(audio);
            };
        } catch {
            resolve(null);
        }
    });
}
