import { User } from "@prisma/client";

export type AvatarType = Pick<User,"email"|"image"|"name">
