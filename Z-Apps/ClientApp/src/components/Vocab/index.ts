import { AppToMount } from "../..";

export const Vocab: AppToMount = {
    key: "Vocab",
    hostname: "vocab.lingual-ninja.com",
    getApp: async () => {
        const module = await import("./App");
        return module.App;
    },
};
