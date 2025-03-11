import { z } from "zod";

export const NarrationStyleSchema = z.object({
  audienceType: z.enum([
    "technical",
    "business",
    "general",
    "academic",
    "children",
  ]),
  duration: z.enum(["brief", "moderate", "detailed"]),
  toneStyle: z.enum([
    "formal",
    "conversational",
    "enthusiastic",
    "professional",
  ]),
  grammarLevel: z.enum(["simple", "intermediate", "advanced"]),
  language: z.string(),
  presentationFlow: z.enum([
    "structured",
    "storytelling",
    "interactive",
    "analytical",
  ]),
  prompt:z.string(),
});

export const defaultStyle: NarrationStyle = {
  audienceType: "general",
  duration: "moderate",
  toneStyle: "professional",
  grammarLevel: "intermediate",
  language: "English",
  presentationFlow: "structured",
  prompt:""
};
export type NarrationStyle = z.infer<typeof NarrationStyleSchema>;
