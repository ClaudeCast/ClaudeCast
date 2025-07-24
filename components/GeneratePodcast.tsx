// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { GeneratePodcastProps } from '@/types'
import React, { useState, useEffect } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader, Wand2, Pencil } from 'lucide-react'

import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "./ui/use-toast"
import { toast } from "sonner";

import { useUploadFiles } from '@xixixao/uploadstuff/react';

const useGeneratePodcast = ({
  setAudio, 
  voiceType, 
  voicePrompt, 
  setAudioStorageId,
  onGenerationStart,
  onGenerationComplete,
  setVoicePrompt
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast: uiToast } = useToast();

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getPodcastAudio = useAction(api.openai.createPodcastAudio);
  const getAudioUrl = useMutation(api.podcasts.getStorageUrl);

  const generateScript = useAction(api.openai.generateContent);

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio('');
    
    if (onGenerationStart) {
      onGenerationStart();
    }

    if(!voiceType) {
      toast.error("Please select a voice type");
      if (onGenerationComplete) onGenerationComplete();
      return setIsGenerating(false);
    }

    if(!voicePrompt) {
      toast.error("Please provide a script to generate the podcast");
      if (onGenerationComplete) onGenerationComplete();
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        text: voicePrompt,
        voice: voiceType
      });

      if (!response || !response.storageId) {
        throw new Error("Failed to generate audio");
      }

      setAudioStorageId(response.storageId);
      setAudio(response.url);
      setIsGenerating(false);
      
      if (onGenerationComplete) {
        onGenerationComplete();
      }
      
      toast.success("Podcast generated successfully");
    } catch (error: any) {
      console.error('Error generating podcast', error);
      toast.error("Error creating the podcast: " + (error.message || "Unknown error"));
      setIsGenerating(false);
      if (onGenerationComplete) onGenerationComplete();
    }
  };

  const generateAIScript = async () => {
    try {
      setIsEditing(true);
      toast.info("Generating podcast script...");
      
      const result = await generateScript({ 
        subject: "Technology", 
        length: 3, 
        style: "informative",
        context: "Create a short demo script for a technology podcast" 
      });
      
      if (result && result.script) {
        setVoicePrompt(result.script);
        toast.success("AI script generated!");
      }
    } catch (error) {
      console.error("Error generating script:", error);
      toast.error("Failed to generate script");
    } finally {
      setIsEditing(false);
    }
  };

  return { isGenerating, generatePodcast, isEditing, generateAIScript }
};

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { 
    isGenerating, 
    generatePodcast, 
    isEditing,
    generateAIScript 
  } = useGeneratePodcast(props);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <Label className="text-16 font-bold text-white-1">
            Podcast Script
          </Label>
          {!props.showEditSection && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2" 
              onClick={generateAIScript}
              disabled={isEditing}
            >
              {isEditing ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  Generate with AI
                </>
              )}
            </Button>
          )}
        </div>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-[--accent-color]"
          placeholder="Enter your podcast script or generate one with AI"
          rows={8}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <Button 
          className="text-16 bg-[--accent-color] py-4 font-bold text-white-1" 
          onClick={generatePodcast}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            'Create Podcast Audio'
          )}
        </Button>
        
        {props.showEditSection && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              props.setAudio('');
              props.setAudioStorageId(null);
            }}
          >
            <Pencil size={16} />
            Edit Script
          </Button>
        )}
      </div>
      
      {props.audio && (
        <div className="mt-5 p-4 bg-black-1/30 rounded-xl border border-[--accent-color]/20">
          <p className="text-white-2 mb-3 text-sm">Preview your podcast audio:</p>
          <audio
            controls
            src={props.audio}
            autoPlay
            className="w-full"
            onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
          />
        </div>
      )}
    </div>
  )
}

export default GeneratePodcast