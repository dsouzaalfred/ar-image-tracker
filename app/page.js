import Image from "next/image";
import ARCard from "./components/ARCard";

const DuckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M8 15C8 15 9 14 10 14C11 14 12 15 12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M19 15C16 15 14 13 14 10C14 7 16 5 19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 19C7.02944 19 3 14.9706 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const VideoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M15 10L20 7V17L15 14M4 5H15V19H4C3.44772 19 3 18.5523 3 18V6C3 5.44772 3.44772 5 4 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 9V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V9L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 14C9 14 10 13 12 13C14 13 15 14 15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 10H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 10H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const arExperiences = [
  {
    title: 'AR Duck',
    description: 'Watch a 3D duck model come to life in AR! The duck rotates smoothly and can be viewed from any angle.',
    href: '/ar/duck',
    icon: <DuckIcon />
  },
  {
    title: 'AR Video',
    description: 'Experience video content in augmented reality. The video appears floating above the marker.',
    href: '/ar/video',
    icon: <VideoIcon />
  },
  {
    title: 'AR Fox',
    description: 'See a 3D fox model in your environment using a custom marker pattern.',
    href: '/ar/fox',
    icon: <FoxIcon />
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] p-5">
      <div className="max-w-3xl mx-auto p-5">
        <h1 className="text-center text-3xl font-bold mb-10">AR Experiences</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {arExperiences.map((experience) => (
            <ARCard key={experience.href} {...experience} />
          ))}
        </div>

        <div className="bg-white rounded-xl p-5 mt-10 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Hiro Marker</h2>
          <p className="mb-4">Use this marker for the Duck and Video experiences:</p>
          <Image 
            src="/hiro.png"
            alt="Hiro Marker"
            width={300}
            height={300}
            className="mx-auto border-2 border-[#1d1d1f] rounded-lg"
          />
          
          <div className="bg-[#f2f2f2] rounded-lg p-4 mt-5">
            <h3 className="text-lg font-semibold mb-2">How to Use</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Choose an AR experience from above</li>
              <li>Allow camera access when prompted</li>
              <li>Point your camera at this marker</li>
              <li>Keep the marker in view while using the experience</li>
              <li>For video, tap the screen once to enable audio</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
