import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Phone,
  Store,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { STORE_INFO } from '../data/storeData';

interface ShopTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TOUR_ITEMS = [
  {
    id: 1,
    title_en: 'Siyaganj Wholesale Storefront',
    title_hi: 'सियागंज थोक दुकान व काउंटर',
    desc_en:
      'Located in the heart of Central India’s biggest dry fruits wholesale hub — Siyaganj, Indore. Serving authentic quality since inception.',
    desc_hi:
      'मध्य भारत के सबसे बड़े ड्राई फ्रूट्स थोक बाजार — सियागंज, इंदौर में स्थित। शुद्धता और प्रामाणिकता की गारंटी।',
    image: '/images/shop-tour/tour-1.jpeg',
    tag_en: 'Retail & Wholesale',
    tag_hi: 'थोक एवं खुदरा',
  },
  {
    id: 2,
    title_en: 'Live Cashew & Dry Fruit Showcase',
    title_hi: 'काजू व ड्राई फ्रूट्स डिस्प्ले काउंटर',
    desc_en:
      'Direct visual grading of W400, W320, W240, W210 Jumbo, JK and JH split cashews for walk-in wholesale buyers.',
    desc_hi:
      'थोक खरीदारों के लिए W400, W320, W240, W210 जंबो और सभी ग्रेड्स का सीधा लाइव निरीक्षण।',
    image: '/images/shop-tour/tour-2.jpeg',
    tag_en: 'Direct Grading',
    tag_hi: 'सीधी ग्रेडिंग',
  },
  {
    id: 3,
    title_en: 'Siyaganj Bulk Warehouse',
    title_hi: 'सियागंज सेंट्रल वेयरहाउस',
    desc_en:
      'Temperature-controlled, hygienic storage holding fresh arrivals of California Almonds, Iranian Pistachios, Walnuts & Cashews.',
    desc_hi:
      'कैलिफोर्निया बादाम, ईरानी पिस्ता, अखरोट व काजू का स्वच्छ व नियंत्रित तापमान में सुरक्षित भंडारण।',
    image: '/images/shop-tour/tour-3.jpeg',
    tag_en: 'Cold & Dry Storage',
    tag_hi: 'स्वच्छ वेयरहाउस',
  },
  {
    id: 4,
    title_en: 'Manual Quality Sorting Tables',
    title_hi: 'हाथों से छांटने की ग्रेडिंग टेबल',
    desc_en:
      'Experienced artisans hand-inspect every batch to eliminate broken kernels and guarantee 100% uniform size.',
    desc_hi:
      'अनुभवी कारीगरों द्वारा हर बैच की बारीकी से जांच ताकि केवल एक समान और उत्तम दाने ही आप तक पहुंचें।',
    image: '/images/shop-tour/tour-4.jpeg',
    tag_en: 'Hand-Inspected',
    tag_hi: 'हैंड-सॉर्टेड',
  },
  {
    id: 5,
    title_en: 'Hygienic Packaging Line',
    title_hi: 'हाईजीनिक ऑटोमेटेड पैकेजिंग',
    desc_en:
      'Food-grade nitrogen-flushed pouch packaging sealing in maximum crispness, aroma and natural crunch.',
    desc_hi:
      'फूड-ग्रेड पैकेजिंग जो प्राकृतिक कुरकुरापन, ताजगी और स्वाद को लंबे समय तक सुरक्षित रखती है।',
    image: '/images/shop-tour/tour-5.jpeg',
    tag_en: 'Food-Grade Sealed',
    tag_hi: 'एयरटाइट सील्ड',
  },
  {
    id: 6,
    title_en: 'FSSAI Certified Quality Testing',
    title_hi: 'FSSAI प्रमाणित गुणवत्ता परीक्षण',
    desc_en:
      'Every consignment is tested for moisture levels, zero adulteration, and certified under FSSAI food standards.',
    desc_hi:
      'बिना किसी मिलावट, नमी-मुक्त और FSSAI मानकों के अनुसार पूरी तरह से प्रमाणित।',
    image: '/images/shop-tour/tour-6.jpeg',
    tag_en: '100% Pure & Lab Tested',
    tag_hi: '100% शुद्ध व प्रमाणित',
  },
  {
    id: 7,
    title_en: 'Ready for Nationwide Dispatch',
    title_hi: 'ऑर्डर डिस्पैच एवं लोडिंग काउंटर',
    desc_en:
      'Daily orders safely boxed, sealed and dispatched across Indore & all over India with fast door delivery.',
    desc_hi:
      'इंदौर और पूरे भारत में सुरक्षित पैकिंग के साथ रोजाना डोर-डिलीवरी के लिए रवाना होने वाले पार्सल।',
    image: '/images/shop-tour/tour-7.jpeg',
    tag_en: 'Fast Shipping',
    tag_hi: 'तेज डिलीवरी',
  },
];

export const ShopTourModal: React.FC<ShopTourModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % TOUR_ITEMS.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + TOUR_ITEMS.length) % TOUR_ITEMS.length);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const current = TOUR_ITEMS[activeIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-stone-900 border border-amber-400/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-stone-950/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-stone-100 flex items-center gap-2">
                {lang === 'hi'
                  ? 'जैनज़ी™ दुकान एवं फैक्ट्री टूर'
                  : 'Jainzee™ Siyaganj Store & Factory Tour'}
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> FSSAI Certified
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                {lang === 'hi'
                  ? 'सियागंज, इंदौर स्थित हमारे थोक स्टोर और प्रोसेसिंग यूनिट की वास्तविक तस्वीरें'
                  : 'Real photographs of our physical wholesale store & processing facilities in Siyaganj, Indore'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Tour"
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Active Image Showcase with Next / Prev */}
          <div className="relative aspect-video sm:aspect-16/9 rounded-xl overflow-hidden bg-stone-950 border border-white/10 group shadow-inner">
            <img
              src={current.image}
              alt={lang === 'hi' ? current.title_hi : current.title_en}
              className="w-full h-full object-contain sm:object-cover transition-opacity duration-300"
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-sm border border-amber-400/40 text-amber-300 text-xs font-semibold">
                {lang === 'hi' ? current.tag_hi : current.tag_en}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-sm border border-white/20 text-stone-300 text-xs font-mono">
                {activeIndex + 1} / {TOUR_ITEMS.length}
              </span>
            </div>

            {/* Navigation Buttons */}
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + TOUR_ITEMS.length) % TOUR_ITEMS.length)
              }
              aria-label="Previous Photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-950/70 border border-white/20 text-white hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500 transition-all cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % TOUR_ITEMS.length)}
              aria-label="Next Photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-950/70 border border-white/20 text-white hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500 transition-all cursor-pointer opacity-90 sm:opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Description of active image */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-white/10 space-y-1.5">
            <h4 className="text-lg font-bold text-amber-400 font-display">
              {lang === 'hi' ? current.title_hi : current.title_en}
            </h4>
            <p className="text-sm text-stone-300 leading-relaxed">
              {lang === 'hi' ? current.desc_hi : current.desc_en}
            </p>
          </div>

          {/* Thumbnails Strip */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2">
              {lang === 'hi' ? 'सभी तस्वीरें देखें (क्लिक करें):' : 'Click to view all photos:'}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {TOUR_ITEMS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative aspect-4/3 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    activeIndex === idx
                      ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20'
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title_en}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-1 text-[10px] font-mono text-white/90 drop-shadow">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Store Location & Trust Banner */}
          <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-300">
            <div className="p-3 rounded-lg bg-stone-950/40 border border-white/5 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-100 block">
                  {lang === 'hi' ? 'दुकान का पता:' : 'Physical Store Address:'}
                </strong>
                <span>Siyaganj Wholesale Market, Indore, Madhya Pradesh 452001</span>
                <a
                  href="https://maps.google.com/?q=Siyaganj+Indore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold"
                >
                  {lang === 'hi' ? 'गूगल मैप्स पर देखें' : 'View on Google Maps'}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-stone-950/40 border border-white/5 flex items-start gap-2.5">
              <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-100 block">
                  {lang === 'hi' ? '100% शुद्धता की गारंटी:' : 'Direct Siyaganj Wholesale:'}
                </strong>
                <span>
                  {lang === 'hi'
                    ? 'बिना बिचौलियों के सीधा थोक मूल्य और प्रयोगशाला द्वारा परीक्षित शुद्धता।'
                    : 'Direct wholesale sourcing with zero middlemen and FSSAI hygiene certification.'}
                </span>
                <a
                  href={`https://wa.me/917649848584?text=${encodeURIComponent(
                    'Hello Jainzee Foods, I saw your Siyaganj shop and factory tour and want to inquire about bulk/order details.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp: +91 7649848584</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
