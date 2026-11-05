import { Language, Product } from '../types';

export function GradeSelector({ product, selectedIndex, onChange, lang }: {
  product: Product;
  selectedIndex: number;
  onChange: (index: number) => void;
  lang: Language;
}) {
  const active = product.grades[selectedIndex] || product.grades[0];
  const gradeName = (label: string) => label.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const codes = [...new Set(product.grades.map(g => gradeName(g.label)))];
  const isCashew = product.category === 'cashews' || /cashew|kaju/i.test(product.name_en);
  const buttonClass = (selected: boolean) => `px-2 py-2 rounded-lg border text-center cursor-pointer transition-colors ${selected
    ? 'bg-amber-400 border-amber-500 text-stone-950 font-semibold'
    : 'bg-white border-stone-200 text-stone-700 hover:border-amber-400'}`;

  if (isCashew) {
    const currentCode = gradeName(active.label);
    const packs = product.grades.map((g, index) => ({ ...g, index }))
      .filter(g => gradeName(g.label) === currentCode);
    return <div className="space-y-3 pt-1">
      <fieldset>
        <legend className="text-xs font-semibold text-stone-600 mb-2">
          {lang === 'hi' ? 'काजू ग्रेड चुनें' : 'Select Cashew Grade'}
        </legend>
        <div className="grid grid-cols-4 gap-1.5">
          {codes.map(code => {
            const index = product.grades.findIndex(g => gradeName(g.label) === code && g.weightGrams === active.weightGrams);
            const target = index >= 0 ? index : product.grades.findIndex(g => gradeName(g.label) === code);
            return <button key={code} type="button" aria-pressed={code === currentCode}
              onClick={() => onChange(target)} className={buttonClass(code === currentCode)}>
              <span className="block text-xs break-words">{code}</span>
              <span className="block text-[11px] font-mono">₹{product.grades[target].price.toLocaleString('en-IN')}</span>
            </button>;
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold text-stone-600 mb-2">
          {lang === 'hi' ? 'पैक साइज चुनें' : 'Select Pack Size'}
        </legend>
        <div className="grid grid-cols-2 gap-1.5">
          {packs.map(pack => <button key={pack.index} type="button" aria-pressed={pack.index === selectedIndex}
            onClick={() => onChange(pack.index)} className={buttonClass(pack.index === selectedIndex)}>
            <span className="block text-xs">{pack.weightGrams >= 1000 ? `${pack.weightGrams / 1000}kg` : `${pack.weightGrams}g`} Pack</span>
            <span className="block text-xs font-mono">₹{pack.price.toLocaleString('en-IN')}</span>
          </button>)}
        </div>
      </fieldset>
    </div>;
  }

  return <fieldset className="pt-1">
    <legend className="text-xs font-semibold text-stone-600 mb-2">
      {lang === 'hi' ? 'पैक साइज चुनें' : 'Select Pack Size'}
    </legend>
    <div className="grid grid-cols-2 gap-1.5">
      {product.grades.map((grade, index) => <button key={index} type="button" aria-pressed={index === selectedIndex}
        onClick={() => onChange(index)} className={buttonClass(index === selectedIndex)}>
        <span className="block text-xs">{grade.label}</span>
        <span className="block text-xs font-mono">₹{grade.price.toLocaleString('en-IN')}</span>
      </button>)}
    </div>
  </fieldset>;
}
