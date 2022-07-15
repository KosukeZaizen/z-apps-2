import { useEffect } from "react";
import ReactLazyLoad, { LazyLoadProps } from "react-lazyload";

export function LazyLoad({
    noLazy,
    ...rest
}: LazyLoadProps & { noLazy?: boolean }) {
    if (noLazy) {
        return <>{rest.children}</>;
    }
    return <ReactLazyLoad offset={500} {...rest} />;
}

export function LazyExecutor({
    fnc,
    ...lazyLoadProps
}: { fnc: () => void } & LazyLoadProps) {
    return (
        <LazyLoad {...lazyLoadProps}>
            <Executor fnc={fnc} />
        </LazyLoad>
    );
}

export function Executor({ fnc }: { fnc: () => void }) {
    useEffect(() => {
        fnc();
    }, [fnc]);

    return null;
}
