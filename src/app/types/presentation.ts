import { Presentation } from "@prisma/client";

export type PresentationDisplayType = Omit<Presentation,"userId">;

