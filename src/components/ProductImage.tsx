import { ImgHTMLAttributes, useState } from 'react';
import { Product } from '../types';

const categoryImages: Partial<Record<Product['category'], string>> = {
  cashews: '/images/cashew.jpeg',
  almonds: '/images/almonds.webp',
  walnuts: '/images/walnuts.webp',
  'dried-fruits': '/images/raisins.webp',
  pistachios: '/images/pistachio.webp',
  makhana: '/static/uploads/Gemini_Generated_Image_6qjj8c6qjj8c6qjj.png',
  gifting: '/images/diwali-gift-box.jpg',
};

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> & { product: Product };

export function ProductImage({ product, alt = product.name_en, ...props }: Props) {
  const primary = product.image?.trim() || categoryImages[product.category] || '';
  const fallback = categoryImages[product.category] || '';
  const [failedSource, setFailedSource] = useState('');
  const [failedFallback, setFailedFallback] = useState('');
  const src = failedSource === primary ? fallback : primary;

  if (!src || (src === fallback && failedFallback === primary)) {
    return <div role="img" aria-label={alt} className={props.className}
      style={{ ...props.style, display: 'grid', placeItems: 'center', background: product.fallbackColor }}>
      <span className="text-sm text-stone-600 p-4 text-center">{alt}</span>
    </div>;
  }

  return <img {...props} src={src} alt={alt} onError={() => {
    if (src === fallback) setFailedFallback(primary);
    else setFailedSource(primary);
  }} />;
}
