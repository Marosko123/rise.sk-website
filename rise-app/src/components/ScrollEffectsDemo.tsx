'use client';

import { useTranslations } from 'next-intl';
import {
  ScrollSectionNavigator,
  MultiLayerParallax,
  VelocityScroll,
  DirectionAwareScroll,
  CharacterReveal,
  ScrollMorph,
  StaggerReveal,
  CurtainReveal
} from './AdvancedScrollEffects';

const demoSections = [
  { id: 'parallax-demo', label: 'Parallax' },
  { id: 'velocity-demo', label: 'Velocity' },
  { id: 'character-demo', label: 'Text Reveal' },
  { id: 'morph-demo', label: 'Morphing' },
  { id: 'stagger-demo', label: 'Stagger' },
  { id: 'curtain-demo', label: 'Curtain' },
];

export default function ScrollEffectsDemo() {
  const t = useTranslations('demo');

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <ScrollSectionNavigator sections={demoSections} />

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center space-y-8">
          <CharacterReveal
            text="Advanced Scroll Effects Demo"
            className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          />
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience cutting-edge scroll interactions and animations
          </p>
        </div>
      </section>

      {/* Multi-Layer Parallax Demo */}
      <section id="parallax-demo" className="min-h-screen">
        <MultiLayerParallax>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center space-y-6 p-8">
              <h2 className="text-5xl font-bold mb-8">Multi-Layer Parallax</h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Multiple layers moving at different speeds create depth and immersion.
                The background, midground, and foreground all move independently.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Layer {i}</h3>
                    <p className="text-gray-300">Content with depth perception</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MultiLayerParallax>
      </section>

      {/* Velocity-Based Animations */}
      <section id="velocity-demo" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
        <VelocityScroll>
          <div className="text-center space-y-6 p-8">
            <h2 className="text-5xl font-bold mb-8">Velocity-Based Effects</h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              Scroll faster or slower to see how the content reacts to your scroll velocity.
              The elements scale and skew based on how fast you're scrolling.
            </p>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/20 rounded-lg h-24 flex items-center justify-center">
                  <span className="text-2xl font-bold">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </VelocityScroll>
      </section>

      {/* Character Reveal Demo */}
      <section id="character-demo" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-teal-900">
        <div className="text-center space-y-12 p-8">
          <h2 className="text-5xl font-bold mb-8">Character-by-Character Reveal</h2>
          <CharacterReveal
            text="Each character appears individually as you scroll, creating a typewriter-like effect that feels magical and engaging."
            className="text-2xl text-gray-200 max-w-4xl leading-relaxed"
          />
          <CharacterReveal
            text="Perfect for highlighting important messages!"
            className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent"
          />
        </div>
      </section>

      {/* Morphing Elements */}
      <section id="morph-demo" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-900 to-red-900">
        <div className="text-center space-y-12 p-8">
          <h2 className="text-5xl font-bold mb-8">Morphing Elements</h2>
          <p className="text-xl text-gray-300 max-w-2xl mb-12">
            Watch elements transform as you scroll - changing shape, size, and rotation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <ScrollMorph key={i}>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 h-48 flex items-center justify-center">
                  <span className="text-2xl font-bold">Morph {i}</span>
                </div>
              </ScrollMorph>
            ))}
          </div>
        </div>
      </section>

      {/* Stagger Reveal Demo */}
      <section id="stagger-demo" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900">
        <div className="text-center space-y-12 p-8">
          <h2 className="text-5xl font-bold mb-8">Stagger Reveal Animation</h2>
          <p className="text-xl text-gray-300 max-w-2xl mb-12">
            Elements appear one after another with a cascading effect
          </p>
          <StaggerReveal staggerDelay={0.2}>
            {[...Array(9)].map((_, i) => (
              <div key={i} className="inline-block m-4 bg-white/20 rounded-lg p-6 w-32 h-32 flex items-center justify-center">
                <span className="text-2xl font-bold">{i + 1}</span>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Curtain Reveal Demo */}
      <section id="curtain-demo" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="text-center space-y-12 p-8">
          <h2 className="text-5xl font-bold mb-8">Curtain Reveal Effect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <CurtainReveal direction="horizontal">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-64 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">Horizontal Curtain</span>
              </div>
            </CurtainReveal>
            <CurtainReveal direction="vertical">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 h-64 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold">Vertical Curtain</span>
              </div>
            </CurtainReveal>
          </div>
        </div>
      </section>

      {/* Direction-Aware Demo */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-green-900">
        <DirectionAwareScroll>
          <div className="text-center space-y-6 p-8">
            <h2 className="text-5xl font-bold mb-8">Direction-Aware Scrolling</h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              This content reacts differently when you scroll up vs down.
              Try scrolling in both directions to see the effect!
            </p>
            <div className="mt-12 bg-white/20 rounded-lg p-8">
              <p className="text-lg">I move and fade based on scroll direction!</p>
            </div>
          </div>
        </DirectionAwareScroll>
      </section>
    </div>
  );
}
