// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
import { ActionCtx, action, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateAudio = action({
  args: { text: v.string(), voice: v.string() },
  handler: async (ctx, { voice, text }) => {
    try {
      const audio = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: voice as SpeechCreateParams["voice"],
        input: text,
      });

      const audioBuffer = await audio.arrayBuffer();
      return audioBuffer;
    } catch (error) {
      console.error("Audio generation error:", error);
      throw new Error(`Audio generation failed: ${error.message}`);
    }
  },
});

export const createImage = action({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    try {
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
        n: 1,
      });

      const imageUrl = image.data[0].url;
      if (!imageUrl) throw new Error("Image generation failed - no URL returned");

      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      return buffer;
    } catch (error) {
      console.error("Image generation error:", error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  },
});

export const generateContent = action({
  args: {
    subject: v.string(),
    length: v.number(),
    style: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { subject, length, style, context } = args;

    try {
      const systemPrompt = `You are an expert podcast script writer. Create engaging, well-structured podcast scripts that sound natural when read aloud.
Follow these guidelines:
- Create natural-sounding dialogue with appropriate pauses and transitions
- Include clear section breaks for different topics
- Use conversational language suitable for speaking
- Avoid complex sentence structures that would be difficult to read aloud
- Include brief intro and outro sections`;

      const result = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Create a ${length}-minute podcast script about ${subject} in a ${style} style.${context ? ` Additional context: ${context}` : ''}`
          }
        ],
        model: "gpt-4o",
        temperature: 0.7,
        max_tokens: 4000,
      });

      const script = result.choices[0].message.content;
      if (!script) throw new Error("Content generation failed - no content returned");

      // Generate title and description based on the script
      const metadataResult = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "Generate a catchy title and brief description for the following podcast script. Format as JSON with 'title' and 'description' fields."
          },
          { role: "user", content: script }
        ],
        model: "gpt-4o",
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      let metadata = { title: "", description: "" };
      try {
        metadata = JSON.parse(metadataResult.choices[0].message.content);
      } catch (err) {
        console.error("Failed to parse metadata JSON", err);
        // Fallback to empty metadata
      }

      // Generate image prompt based on the script
      const imagePromptResult = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: "Create a descriptive, detailed image prompt for DALL-E to visualize this podcast. The prompt should create a visually appealing thumbnail image that captures the essence of the podcast content. Focus on creating a prompt that will work well for a 1024x1024 image."
          },
          { role: "user", content: `Podcast Title: ${metadata.title}\nPodcast Content: ${script.substring(0, 1000)}` }
        ],
        model: "gpt-4o",
        temperature: 0.8,
      });

      const imagePrompt = imagePromptResult.choices[0].message.content || "";

      return {
        title: metadata.title,
        description: metadata.description,
        script,
        imagePrompt,
      };
    } catch (error) {
      console.error("Content generation error:", error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  },
});

export const createPodcastAudio = action({
  args: {
    text: v.string(),
    voice: v.union(
      v.literal("alloy"),
      v.literal("echo"),
      v.literal("fable"),
      v.literal("onyx"),
      v.literal("nova"),
      v.literal("shimmer")
    ),
  },
  handler: async (ctx, args) => {
    try {
      const audio = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: args.voice,
        input: args.text,
        speed: 0.97, // Slightly slower for better articulation
      });

      const audioBuffer = await audio.arrayBuffer();
      const audioBlob = new Blob([audioBuffer]);
      const storageId = await ctx.storage.store(audioBlob);
      const url = await ctx.storage.getUrl(storageId);

      return { url, storageId };
    } catch (error) {
      console.error("Audio generation error:", error);
      throw new Error(`Audio generation failed: ${error.message}`);
    }
  },
});

export const createPodcastImage = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Enhance the prompt for better results
      const enhancedPrompt = `${args.prompt}. Make it high quality, visually appealing, and suitable for a podcast thumbnail. Use vibrant colors and professional composition.`;
      
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
      });

      const imageUrl = image.data[0]?.url;
      if (!imageUrl) throw new Error("Image generation failed - no URL returned");

      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer]);
      const storageId = await ctx.storage.store(blob);
      const url = await ctx.storage.getUrl(storageId);

      return { url, storageId };
    } catch (error) {
      console.error("Image generation error:", error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  },
});

// For backwards compatibility
export const generateImage = mutation({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: args.prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "vivid",
      });

      const url = image.data[0]?.url;
      if (!url) throw new Error("Image generation failed - no URL returned");

      return url;
    } catch (error) {
      console.error("Image generation error:", error);
      throw new Error(`Image generation failed: ${error.message}`);
    }
  },
});

// For backwards compatibility
export const generateSpeech = mutation({
  args: {
    content: v.string(),
    voice: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { content, voice } = args;

      const audio = await openai.audio.speech.create({
        model: "tts-1-hd",
        voice: voice,
        input: content,
      });

      const buffer = await audio.arrayBuffer();
      const storageId = await ctx.storage.store(Buffer.from(buffer));

      return storageId;
    } catch (error) {
      console.error("Speech generation error:", error);
      throw new Error(`Speech generation failed: ${error.message}`);
    }
  },
});
