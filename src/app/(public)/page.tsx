import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StoryCard } from "@/components/home/StoryCard";

export default function Home() {
  return (
    <div className="w-full flex flex-col pt-24 md:pt-44 pb-24 text-foreground selection:bg-neutral-200 selection:text-black">
      {/* Hero Section */}
      <section className="px-6 md:px-12 w-full max-w-[1500px] mx-auto mb-20 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] tracking-tighter uppercase font-bold max-w-4xl">
            DEPLYZE<br />COMMUNITY
          </h1>
          
          <div className="max-w-xs md:max-w-sm shrink-0 md:pb-4">
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-6 font-medium">
              Deplyze Community is a space for raw stories, honest reflections, and meaningful dialogue. Together, we grow through every prayer.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center text-sm font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
            >
              Join the Community <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Thumbnails Section */}
      <section className="w-full max-w-[1500px] mx-auto mb-32 md:mb-48 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StoryCard 
            title="Building Church Community" 
            author="Deplyze Collective"
            videoSrc="/videos/church-community.mp4"
          />
          <StoryCard 
            title="Worship: Great Are You Lord" 
            author="Worship Sessions"
            videoSrc="/videos/great-are-you-lord.music.mp4"
          />
          <StoryCard 
            title="Voices of Global Prayer" 
            author="Global Hub"
            videoSrc="/videos/prayers.mp4"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="w-full max-w-[1500px] mx-auto mb-32 md:mb-48 px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-border pb-4">
              ABOUT OUR COMMUNITY
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              From intimate reflections to collective wisdom, every prayer in Deplyze is part of something bigger &mdash; a safe space to pause, reflect, and be heard.
            </p>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-neutral-400">
              Meaningful dialogues that <span className="text-black font-medium">ignite ideas</span>, <span className="text-black font-medium">deepen connection</span>, and <span className="text-black font-medium">welcome every prayer</span> &mdash; whether you're here for deep talks or light moments, you belong here.
            </h3>
          </div>
        </div>
      </section>

      {/* Global Connection Section */}
      <section className="w-full max-w-[1500px] mx-auto px-6 md:px-12">
         <h2 className="text-sm font-bold uppercase tracking-widest mb-6">
            YOU'RE NOT PRAYING ALONE
         </h2>
         <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
            <h3 className="text-3xl md:text-5xl font-normal leading-tight tracking-tight text-neutral-400 max-w-2xl">
               From every timezone and background, Deplyze brings <span className="text-black font-medium">people together</span> through the power of meaningful conversations.
            </h3>
            <Link 
              href="/signup" 
              className="inline-flex items-center text-sm font-semibold border-b border-black pb-0.5 hover:opacity-70 transition-opacity shrink-0"
            >
              Join the Community <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
         </div>

         {/* Map visualization */}
         <div className="w-full relative aspect-[2/1] md:aspect-[2.5/1] mb-24 opacity-80 mix-blend-multiply">
            <Image 
               src="/map.png"
               alt="Global community map"
               fill
               className="object-contain"
            />
         </div>

         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-border pt-12">
            <StatBlock number="40+" title="Countries Represented" desc="Curated stories that reflect real voices from around the world." />
            <StatBlock number="120K+" title="Monthly Prayers" desc="Tuning in from cities, coastlines, and cafés worldwide." />
            <StatBlock number="90%" title="Member Satisfaction" desc="Deplyze feels personal—like being part of something bigger." />
            <StatBlock number="300+" title="Local Circles" desc="Stories that inspire, from artists to entrepreneurs." />
         </div>
      </section>
    </div>
  );
}

function StatBlock({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-4xl md:text-5xl font-medium tracking-tight">{number}</h4>
      <div>
         <p className="text-sm font-semibold mb-2">{title}</p>
         <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">{desc}</p>
      </div>
    </div>
  )
}
