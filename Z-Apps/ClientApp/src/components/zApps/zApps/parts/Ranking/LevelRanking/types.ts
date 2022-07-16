import { User } from "../../../../../../common/hooks/useUser";

export type UserForRanking = Pick<
    User,
    "userId" | "name" | "level" | "xp" | "avatarPath"
>;
