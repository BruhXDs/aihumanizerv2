import { BookOpen } from 'lucide-react';
import { ESSAY_TEXT } from '../data/essay';

export default function EssayView() {
  const paragraphs = ESSAY_TEXT.split('\n\n');

  const title = paragraphs[0];
  const body = paragraphs.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-sm font-medium text-slate-500 tracking-wide uppercase"></span>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 text-center mb-12 leading-tight">{title}</h1>

        <article className="space-y-6">
          {body.map((paragraph, index) => (
            <p
              key={index}
              className="text-slate-700 leading-relaxed text-lg"
              style={{ lineHeight: 1.8 }}
            >
              {paragraph}
            </p>
          ))}
        </article>

<div className="mt-16 text-center"> 
  <div className="inline-flex items-center justify-center gap-2"> 
    <kbd className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-300 rounded-md shadow-sm"> - MR </kbd> 
    <span className="text-sm text-slate-500"></span> 
  </div>
</div>


      </div>
    </div>
  );
}
