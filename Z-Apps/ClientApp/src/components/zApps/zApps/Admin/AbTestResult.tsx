import { Card } from "@material-ui/core";
import { useEffect, useState } from "react";
import Helmet from "../../../shared/Helmet";

export default function AbTestResult() {
    const [testNames, setTestNames] = useState<string[]>([]);

    useEffect(() => {
        fetchTestNames().then(names => {
            setTestNames(names.sort());
        });
    }, []);

    return (
        <div style={{ marginTop: 30 }}>
            <Helmet noindex />
            {testNames.length > 0
                ? testNames.map(testName => (
                      <ResultCard key={testName} testName={testName} />
                  ))
                : "Loading..."}
        </div>
    );
}

function ResultCard({ testName }: { testName: string }) {
    const [open, setOpen] = useState(false);
    return (
        <Card style={{ marginBottom: 10, padding: 10 }}>
            <a
                key={testName}
                href="#"
                onClick={ev => {
                    ev.preventDefault();
                    setOpen(!open);
                }}
            >
                {testName}
            </a>
            {open && <TestResult testName={testName} />}
        </Card>
    );
}

function TestResult({ testName }: { testName: string }) {
    const [testRecords, setTestRecords] = useState<AbTest[]>([]);

    useEffect(() => {
        fetchTestResult(testName).then(records => setTestRecords(records));
    }, []);

    const recordsForKey = testRecords.reduce((acc, val) => {
        return { ...acc, [val.key]: [...(acc[val.key] ?? []), val] };
    }, {} as { [key: string]: AbTest[] });
    const keys = Object.keys(recordsForKey);

    return (
        <div>
            <div>Total: {getResult(testRecords)}</div>
            <Card style={{ margin: 10, padding: 10 }}>
                {keys.map(key => {
                    return (
                        <div key={key}>
                            {key}: {getResult(recordsForKey[key])}
                        </div>
                    );
                })}
            </Card>
        </div>
    );
}

function getResult(testRecords: AbTest[]) {
    const successNumber = testRecords.filter(r => r.isSuccess).length;
    const accessNumber = testRecords.length - successNumber;
    const percentage = Math.floor((100 * successNumber) / accessNumber);

    return `${successNumber} / ${accessNumber} = ${percentage}%`;
}

async function fetchTestNames(): Promise<string[]> {
    const res = await fetch("/api/SystemBase/GetAllTestName");
    const { testNames } = await res.json();
    return testNames;
}

async function fetchTestResult(testName: string): Promise<AbTest[]> {
    const res = await fetch(
        "/api/SystemBase/GetTestRecordsWithDate?testName=" + testName
    );
    const { records } = await res.json();
    return records;
}

type AbTest = {
    testName: string;
    key: string;
    isSuccess: boolean;
    date: string;
};
