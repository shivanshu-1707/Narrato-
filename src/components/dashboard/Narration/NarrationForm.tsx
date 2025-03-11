"use client";

import React, { ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertCircleIcon, Loader2 } from "lucide-react";
import {
  NarrationStyle,
  NarrationStyleSchema,
} from "@/app/types/narration.types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Presentation } from "@prisma/client";
import toast from "react-hot-toast";

interface NarrationFormProps {
  defaultValues?: Partial<NarrationStyle>;
  isRegenerating?: boolean;
  isGenerating: boolean;
  isGenerationComplete:boolean;
  presentation: Presentation;
  setIsGenerationComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  setRawResponse: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  changeTab: React.Dispatch<React.SetStateAction<string>>;
  handleClear: () => void;
}

export const NarrationForm = forwardRef(function NarrationForm({
  defaultValues = {},
  isRegenerating = false,
  isGenerating,
  presentation,
  setRawResponse,
  setIsGenerating,
  setIsGenerationComplete,
  setError,
  changeTab,
  handleClear,
}:NarrationFormProps,ref:ForwardedRef<HTMLFormElement>) {
  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<NarrationStyle>({
    resolver: zodResolver(NarrationStyleSchema),
    defaultValues: {
      audienceType: "general",
      duration: "moderate",
      toneStyle: "conversational",
      grammarLevel: "intermediate",
      language: "English",
      presentationFlow: "structured",
      prompt: "",
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: NarrationStyle) => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsGenerating(true);
    setIsGenerationComplete(false);
    handleClear();
    changeTab("narrations");

    try {
      const dataToSend = {
        url: presentation.link,
        type: presentation.type,
        narrationStyle: data,
      };

      const res = await fetch("/api/narration/create", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res || !res.ok || !res.body) {
        throw new Error("Error generating narrations!!");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setRawResponse((prev) => prev + chunk);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast("Generation Cancelled", {
          icon: <AlertCircleIcon className="text-pretty text-cyan-300" />,
          id: "CANCEL_REQUEST",
          duration: 1000,
        });
      } else {
        setError("Error occured while generating narrations");
        toast.error("Error generating narrations");
      }
    } finally {
      setIsGenerating(false);
      setIsGenerationComplete(true);
    }
  };

  const cancelReq = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  useEffect(()=>{
    if(!isGenerating){
      cancelReq();
    } 
  },[isGenerating]);

  return (
    <Card className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} ref={ref}>
          <CardHeader>
            <CardTitle className="text-xl tracking-normal">
              {"Narration Style"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="audienceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="children">Children</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toneStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="conversational">
                          Conversational
                        </SelectItem>
                        <SelectItem value="enthusiastic">
                          Enthusiastic
                        </SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grammarLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grammar</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grammar" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter language" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="presentationFlow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flow</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select flow" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="structured">Structured</SelectItem>
                        <SelectItem value="storytelling">
                          Storytelling
                        </SelectItem>
                        <SelectItem value="interactive">Interactive</SelectItem>
                        <SelectItem value="analytical">Analytical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your prompt for narration generation..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {true && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelReq}
                className="hover:bg-slate-400/50"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isRegenerating ? "Regenerate" : "Generate"} Narration
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
});
