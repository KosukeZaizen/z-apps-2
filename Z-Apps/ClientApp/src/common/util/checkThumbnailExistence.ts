export async function checkThumbnailExistence(
    videoId: string,
    fileName: string
): Promise<number> {
    const res = await fetch(
        `/api/Articles/CheckThumbnailExistence?videoId=${videoId}&fileName=${fileName}`
    );
    return res.json();
}
