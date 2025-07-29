// @ts-nocheck
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import PodcastCard from '@/components/PodcastCard'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from '@/components/LoaderSpinner';
import { motion } from 'framer-motion';
import { TrendingUp, Play, Mic, Sparkles, Image as ImageIcon, PlayCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-black-2/40 border border-black-4/50 backdrop-blur-sm rounded-xl p-6 flex flex-col gap-4"
  >
    <div className="w-12 h-12 rounded-full bg-[--accent-color]/20 flex items-center justify-center">
      <Icon className="w-6 h-6 text-[--accent-color]" />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-white-2">{description}</p>
  </motion.div>
);

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  if(!trendingPodcasts) return <LoaderSpinner />

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative px-4 py-20 sm:py-32 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Create Professional Podcasts <span className="text-[--accent-color]">with AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-white-2 mb-8 max-w-2xl mx-auto">
            Transform your ideas into engaging podcasts in minutes with AI-powered voice generation, 
            content creation, and stunning artwork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[--accent-color] hover:bg-[--accent-color]/90">
              <Link href="/create-podcast">
                <Mic className="mr-2 h-5 w-5" />
                Create Podcast
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/discover">
                <PlayCircle className="mr-2 h-5 w-5" />
                Browse Podcasts
              </Link>
            </Button>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto mb-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Choose ClaudeCast</h2>
          <p className="text-white-2 max-w-2xl mx-auto">Our AI-powered platform provides everything you need to create professional podcasts without expensive equipment or technical expertise.</p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Mic}
            title="HD Voice Generation"
            description="Choose from multiple premium voices with natural-sounding speech and perfect articulation."
          />
          <FeatureCard 
            icon={Sparkles}
            title="AI Content Creation"
            description="Generate engaging podcast scripts with our advanced GPT-4o AI. No writing expertise required."
          />
          <FeatureCard 
            icon={ImageIcon}
            title="Custom Artwork"
            description="Create stunning podcast artwork with DALL-E 3. Automatically generate visuals that match your content."
          />
        </div>
      </section>

      {/* Trending Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative py-16 px-4"
      >
        {/* Section Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black-2/50 border border-black-4/60 backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-[--accent-color]" />
              <h2 className="text-xl font-bold text-white">Trending Podcasts</h2>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-[--accent-color]/60 to-transparent" />
          </div>

          {/* Podcast Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {trendingPodcasts?.slice(0, 4).map(({ _id, podcastTitle, podcastDescription, imageUrl }, index) => (
              <motion.div
                key={_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="group relative"
              >
                <Link href={`/podcasts/${_id}`}>
                  <div className="relative overflow-hidden rounded-xl">
                    {/* Image */}
                    <div className="relative aspect-square">
                      <img 
                        src={imageUrl as string} 
                        alt={podcastTitle}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black-1 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1.1 }}
                            className="w-16 h-16 rounded-full bg-[--accent-color]/80 flex items-center justify-center backdrop-blur-sm"
                          >
                            <Play className="w-8 h-8 text-white fill-current" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black-1 to-transparent">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{podcastTitle}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2">{podcastDescription}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/discover" className="flex items-center">
                Explore All Podcasts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-gradient-to-tr from-black-1 to-black-2/70 my-10 rounded-3xl max-w-7xl mx-auto"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Create Your First Podcast?</h2>
          <p className="text-white-2 mb-8">
            Get started in minutes with our intuitive creation tools. No technical skills required.
          </p>
          <Button asChild size="lg" className="bg-[--accent-color] hover:bg-[--accent-color]/90">
            <Link href="/create-podcast">
              Start Creating Now
            </Link>
          </Button>
        </div>
      </motion.section>
    </div>
  )
}

export default Home