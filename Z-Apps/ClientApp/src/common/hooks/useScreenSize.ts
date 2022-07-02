import { useAppState } from "../appState";

export function useScreenSize() {
    const [screenSize] = useAppState("screenSize");
    return screenSize;
}
