import { useEffect, useState } from "react";
import { sendPost, shuffle } from "../functions";

export function useAbTest<T extends ReadonlyArray<string>>({
    testName,
    keys,
    initialKey,
    open = true,
}: {
    testName: string; // max length is 200 (DB column limit)
    keys: T; // max length of each string is 200 (DB column limit)
    initialKey?: T[number];
    open?: boolean;
}) {
    const [key, setKey] = useState(initialKey);
    const [isAlreadySuccess, setAlreadySuccess] = useState(false);

    useEffect(() => {
        if (!open) {
            setKey(initialKey);
            return;
        }
        fetchKey(testName, keys).then(key => {
            setKey(key);
            setAlreadySuccess(false);
        });
    }, [testName, ...keys, open, initialKey]);

    return {
        abTestSuccess: () => {
            if (key && !isAlreadySuccess) {
                setAlreadySuccess(true);
                fetchSuccess(testName, key);
            }
        },
        abTestKey: key,
    };
}

const noFetch =
    location.href.includes("://localhost") || localStorage.getItem("isAdmin");

async function fetchKey<T extends ReadonlyArray<string>>(
    testName: string,
    keys: T
): Promise<T[number]> {
    try {
        if (noFetch) {
            console.log("GetAbTestKey", {
                testName,
                keys,
            });
            if (testName.length > 200) {
                alert(
                    "AB test error! Maximum length of testName is 200! It's because of the DB table's column setting!"
                );
            }
            const tooLongKey = keys.find(k => k.length > 200);
            if (tooLongKey) {
                alert(
                    "AB test error! A too long AB test key is included! Test Name:" +
                        testName +
                        "  Key:" +
                        tooLongKey +
                        "   It's because of the DB table's column setting!"
                );
            }
            return shuffle(keys)[0];
        }

        const { key } = await sendPost(
            {
                testName,
                keys,
            },
            `/api/SystemBase/GetAbTestKey`
        );
        return key;
    } catch {
        return shuffle(keys)[0];
    }
}

function fetchSuccess(testName: string, key: string) {
    if (noFetch) {
        console.log("GetAbTestKey", {
            testName,
            key,
        });
        return;
    }
    sendPost(
        {
            testName,
            key,
        },
        `/api/SystemBase/AbTestSuccess`
    );
}
