import { AppToMount } from "../..";

export const Game: AppToMount = {
    key: "game",
    hostname: "game.lingual-ninja.com",
    getApp: async () => {
        const module = await import("./App");
        return module.App;
    },
};
