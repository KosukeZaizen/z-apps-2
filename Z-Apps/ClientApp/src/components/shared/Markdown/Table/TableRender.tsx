import React, { DetailedHTMLProps, TableHTMLAttributes } from "react";

export const TableRender = ({
    columnAlignment,
    ...rest
}: DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
> & { columnAlignment: unknown }) => (
    <div
        style={{
            width: "100%",
            overflow: "hidden",
            borderRadius: 10,
            marginTop: 25,
            marginBottom: 25,
        }}
    >
        <div
            style={{
                width: "100%",
                overflowX: "auto",
                position: "relative",
                transform: "scale(1, -1)",
            }}
        >
            <table {...rest} style={{ margin: 0, transform: "scale(1, -1)" }} />
        </div>
    </div>
);
