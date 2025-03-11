"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";
import { PresentationDisplayType } from "../types/presentation";

const getPresentations = async () => {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return [];
    }
    const presentation: PresentationDisplayType[] =
      await prisma.presentation.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          link: true,
          name: true,
          createdAt: true,
          title: true,
          type: true,
          public_id: true,
          thumbnail: true,
          updatedAt: true,
          thumbnail_public_id:true,
        },
      });

    return presentation;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getPresentations;
