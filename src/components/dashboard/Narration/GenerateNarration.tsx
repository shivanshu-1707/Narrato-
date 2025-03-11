"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Presentation } from "@prisma/client";
import { NarrationForm } from "./NarrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Narrations from "./Narrations";
import toast from "react-hot-toast";

type Props = {
  presentation: Presentation;
};

const GenerateNarration = ({ presentation }: Props) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerationComplete, setIsGenerationComplete] =
    useState<boolean>(false);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [slideNarrations, setSlideNarrations] = useState<string[]>([]);
  const [tab, setTab] = useState<string>("prompt");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (rawResponse.trim().length > 0) {
      const narrationsArray = rawResponse
        .split("<|>")
        .map((text) => text.trim())
        .filter((text) => text.length > 0);
      setSlideNarrations(narrationsArray);
    }
  }, [rawResponse]);

  const saveToDb = useCallback(async () => {
    try {
      const response = await fetch("/api/narration/save", {
        method: "POST",
        body: JSON.stringify({
          pid: presentation.id,
          rawNarration: rawResponse,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        toast.success("Saved");
      } else {
        throw new Error("failed to save");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Some unknown error ocurred");
      }
    }
  }, [presentation, rawResponse]);

  useEffect(() => {
    if (isGenerationComplete) {
      saveToDb();
      setIsGenerationComplete(false);
    }
  }, [isGenerationComplete, saveToDb]);

  useEffect(() => {
    const fetchNarration = async () => {
      const response = await fetch("/api/narration", {
        method: "POST",
        body: JSON.stringify({ pid: presentation.id }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        const narration = data.narration;
        if(narration){
          setRawResponse(narration.content);
        }
      }
    };

    fetchNarration();
  }, [presentation]);

  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const handleClear = () => {
    setSlideNarrations([]);
    setRawResponse("");
  };
  return (
    <>
      <div className="relative rounded-lg   flex flex-col space-y-6 w-full max-w-4xl mx-auto h-[600px]">
        <Tabs defaultValue="prompt" value={tab} className="w-full h-full">
          <TabsList className="w-full mb-4 grid grid-cols-2 rounded-lg  p-2 bg-muted dark:bg-secondary">
            <TabsTrigger
              value="prompt"
              className="rounded-md transition-all duration-300 data-[state=active]:bg-popover p-1"
              onClick={() => {
                setTab("prompt");
              }}
            >
              Prompt
            </TabsTrigger>
            <TabsTrigger
              value="narrations"
              className="rounded-md transition-all duration-300 data-[state=active]:bg-popover p-1"
              onClick={() => {
                setTab("narrations");
              }}
            >
              Narrations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="prompt" className="h-[530px] w-full">
            <NarrationForm
              ref={formRef}
              isGenerationComplete={isGenerationComplete}
              setIsGenerationComplete={setIsGenerationComplete}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              presentation={presentation}
              setError={setError}
              setRawResponse={setRawResponse}
              changeTab={setTab}
              handleClear={handleClear}
            />
          </TabsContent>
          <TabsContent value="narrations" className="h-[530px] w-full">
            <Narrations
              setError={setError}
              retry={triggerSubmit}
              slideNarrations={slideNarrations}
              error={error}
              changeTab={setTab}
              isGenerating={isGenerating}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default GenerateNarration;
