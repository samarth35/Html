import React from 'react';
import { Store, MapPin, ShieldCheck, Award, Eye, Phone, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TOUR_ITEMS } from './ShopTourModal';

interface ShopTourSectionProps {
  lang: Language;
  onOpenModal: () => void;
}

export const ShopTourSection: React.FC<ShopTourSectionProps> = ({
  lang,
  onOpenModal,
}) => {
  return (
    <section id="shop-tour" className="py-16 bg-[#171412] text-white border-t border-b border-amber-400/20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सियागंज इंदौर स्टोर एवं फैक्ट्री टूर' : 'Siyaganj Store & Factory Tour'}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-100">
              {lang === 'hi' ? 'हमारी दुकान एवं प्रोसेसिंग यूनिट' : 'Visit Our Physical Shop & Factory'}
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-2xl">
              {lang === 'hi'
                ? 'मध्य भारत के प्रमुख थोक बाजार सियागंज इंदौर से सीधा जुड़ाव। देखें कैसे स्वच्छ और सुरक्षित माहौल में तैयार होते हैं आपके पसंदीदा ड्राई फ्रूट्स।'
                : 'Direct from Siyaganj, Indore — the dry fruit heart of Central India. Experience our authentic grading tables, wholesale counters and certified hygienic packaging.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-stone-950 hover:bg-amber-300 font-semibold text-sm transition-all shadow-md hover:shadow-amber-400/20 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{lang === 'hi' ? 'पूरा फोटो टूर देखें (7 फोटोज)' : 'View Full Photo Tour (7 Photos)'}</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOUR_ITEMS.slice(0, 4).map((item, idx) => (
            <div
              key={item.id}
              onClick={onOpenModal}
              className="group relative rounded-xl overflow-hidden bg-stone-900 border border-white/10 hover:border-amber-400/50 transition-all cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div className="aspect-4/3 overflow-hidden bg-stone-950">
                <img
                  src={item.image}
                  alt={item.title_en}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
              </div>

              <div className="p-4 space-y-1.5 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {lang === 'hi' ? item.tag_hi : item.tag_en}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-stone-100 group-hover:text-amber-300 transition-colors">
                  {lang === 'hi' ? item.title_hi : item.title_en}
                </h3>
                <p className="text-xs text-stone-400 line-clamp-2">
                  {lang === 'hi' ? item.desc_hi : item.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-8 p-4 rounded-xl bg-stone-900/80 border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm text-stone-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Siyaganj, Indore, MP (452001)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% FSSAI Certified Hygienic Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Direct Wholesale Sourcing — Zero Middlemen</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Helpline: +91 7649848584</span>
          </div>
        </div>
      </div>
    </section>
  );
};
