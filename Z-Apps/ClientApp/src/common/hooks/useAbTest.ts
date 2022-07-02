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

const isLocalHost = location.href.includes("://localhost");

async function fetchKey<T extends ReadonlyArray<string>>(
    testName: string,
    keys: T
): Promise<T[number]> {
    try {
        if (isLocalHost) {
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
    if (isLocalHost) {
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
