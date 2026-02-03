import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { navigate } from '../router';

export const OurStoryPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Browse
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          
          {/* Image Section */}
          <div className="w-full h-64 md:h-full">
            <img 
              src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1000&auto=format&fit=crop"
              alt="Artisan working with fabric"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Section */}
          <div className="p-8 md:p-12">
            <h1 className="font-heading text-4xl font-extrabold tracking-tighter text-neutral-900 mb-4">
              Our Story
            </h1>
            
            <div className="space-y-5 text-neutral-600 leading-relaxed">
              <p>
                At Kulture Kloze, we don’t just sell clothes; we archive identity.
              </p>
              <p>
                We believe African style shouldn't be trapped in a museum or a history book—it belongs on the street, in the club, and in your daily rotation. But for us, 'reimagining heritage' goes deeper than the fabric.
              </p>
              <blockquote className="border-l-4 border-primary-500 pl-4 italic text-neutral-800 font-medium">
                Every piece tells a story of empowerment. By sourcing hand-picked vintage and collaborating with emerging designers, we are building a sustainable ecosystem that keeps wealth and artistry within our communities.
              </blockquote>
              <p>
                We aren't just giving new life to old threads; we are providing a global stage for the local hands that create them.
              </p>
              <p>
                When you wear Kulture Kloze, you aren't just wearing a brand—you’re investing in the people, the craft, and the future of African creativity.
              </p>
              <p className="font-semibold text-neutral-800">
                This is heritage, reimagined. This is culture, empowered.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
