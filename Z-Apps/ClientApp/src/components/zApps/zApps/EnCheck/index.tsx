import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Helmet } from "../../../shared/Helmet";

export default function EnCheck(
    props: RouteComponentProps<{ pageName: string }>
) {
    return (
        <>
            <Helmet noindex />
            <h1>ToyaCheck</h1>
        </>
    );
}
