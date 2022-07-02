export async function audioPlayAsync(audio: HTMLAudioElement) {
    return new Promise<void>((resolve, reject) => {
        try {
            audio.onended = () => {
                resolve();
            };
            audio.play();
        } catch (err) {
            reject(err);
        }
    });
}

