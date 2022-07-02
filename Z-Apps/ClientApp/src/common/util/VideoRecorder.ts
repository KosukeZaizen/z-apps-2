export class VideoRecorder {
    mediaRecorder?: MediaRecorder;
    videoName: string = "";
    recordingState = { isRecording: false };

    prepareRecordingAsync = async (videoName?: string) => {
        if (videoName) {
            this.videoName = videoName;
        }
        if (!this.mediaRecorder) {
            this.mediaRecorder = await this.getMediaRecorder();
        }

        alert("Hide the bar below!");
    };

    startRecording = () => {
        if (!this.mediaRecorder) {
            alert("Not prepared yet!!!!!!!!!!!!!");
            return;
        }

        this.beforeRecording();

        this.recordingState.isRecording = true;
        this.mediaRecorder?.start();

        const checkStop = () => {
            if (this.recordingState.isRecording) {
                setTimeout(checkStop, 500);
            } else {
                this.mediaRecorder?.stop();
                setTimeout(this.afterRecording, 1000);
            }
        };
        checkStop();
    };

    stopRecording = () => {
        this.recordingState.isRecording = false;
    };

    private getHandleStop = (blobData: Blob) => {
        return async () => {
            const blob = new Blob([blobData], {
                type: "video/webm;codecs=vp9",
            });

            var url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";

            a.href = url;
            a.download = this.videoName || "recordedVideo";
            a.click();
            window.URL.revokeObjectURL(url);

            a.remove();
        };
    };

    private getMediaRecorder = async () => {
        const displayOptions = {
            video: {
                cursor: "never",
            } as MediaTrackConstraints,
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 192000,
            },
        };

        // @ts-ignore
        const stream = await navigator.mediaDevices.getDisplayMedia(
            displayOptions
        );
        const options = { mimeType: "video/webm;codecs=vp9" };

        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (e: BlobEvent) => {
            console.log("The video data is available");
            mediaRecorder.onstop = this.getHandleStop(e.data);
        };

        return mediaRecorder;
    };

    private beforeRecording = () => {
        hideMouseCursor();
    };

    private afterRecording = () => {
        console.log("after recording");
        showMouseCursor();
    };
}

export function hideMouseCursor() {
    const html = document.querySelector("html");
    if (html) {
        html.style.cursor = "none";
    }
}

export function showMouseCursor() {
    const html = document.querySelector("html");
    if (html) {
        html.style.cursor = "auto";
    }
}
