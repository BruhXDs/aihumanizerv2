import { useEffect, useState } from 'react';
import { ArrowLeft, Copy, RotateCw, Wand2 } from 'lucide-react';
import EssayView from './components/EssayView';
import { ESSAY_TEXT } from './data/essay';
import { humanizeText } from './services/textProcessor';
import { calculateReadability, type ReadabilityMetrics } from './utils/readability';

type ViewMode = 'essay' | 'humanizer';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('essay');
  const [inputText, setInputText] = useState(ESSAY_TEXT);
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && event.target instanceof HTMLElement) {
        const isTyping = event.target.tagName === 'TEXTAREA' || event.target.tagName === 'INPUT';
        if (!isTyping) {
          event.preventDefault();
          setViewMode('humanizer');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleHumanize = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setProgress(0);
    setOutputText('');
    setMetrics(null);

    try {
      const result = await humanizeText(inputText, setProgress);
      setOutputText(result);
      setMetrics(calculateReadability(result));
    } catch (error) {
      console.error('Error humanizing text:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleCopy = async () => {
    if (outputText) await navigator.clipboard.writeText(outputText);
  };

  const handleReset = () => {
    setInputText(ESSAY_TEXT);
    setOutputText('');
    setMetrics(null);
    setProgress(0);
  };

  if (viewMode === 'essay') {
    return <EssayView />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="relative text-center mb-10">
          <button
            onClick={() => setViewMode('essay')}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Essay
          </button>
          <div className="flex items-center justify-center gap-3 mb-3">
            <Wand2 className="w-9 h-9 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">AI Text Humanizer</h1>
          </div>
          <p className="text-slate-600 text-lg">Transform your writing into natural, human-like text</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <section className="bg-white rounded-2xl shadow-lg p-6 transition-shadow hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Original text</h2>
              <span className="text-sm text-slate-500">
                {inputText.split(/\s+/).filter((word) => word).length} words
              </span>
            </div>
            <textarea
              className="w-full h-96 p-4 border-2 border-slate-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 transition-colors text-slate-700 leading-relaxed"
              placeholder="Paste your text here..."
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              disabled={isProcessing}
            />
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-6 transition-shadow hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Humanized text</h2>
              {outputText && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              )}
            </div>
            <div className="w-full h-96 p-4 border-2 border-slate-200 rounded-xl overflow-y-auto bg-slate-50">
              {isProcessing ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <p className="text-slate-600 mb-2">Processing your text...</p>
                  <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{Math.round(progress)}%</p>
                </div>
              ) : outputText ? (
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{outputText}</p>
              ) : (
                <p className="text-slate-400 italic">Your humanized text will appear here...</p>
              )}
            </div>
          </section>
        </div>

        {metrics && (
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Text metrics</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[160px]"><p className="text-sm text-slate-500 mb-1">Words</p><p className="text-2xl font-bold text-slate-800">{metrics.words}</p></div>
              <div className="flex-1 min-w-[160px]"><p className="text-sm text-slate-500 mb-1">Characters</p><p className="text-2xl font-bold text-slate-800">{metrics.characters}</p></div>
              <div className="flex-1 min-w-[200px]"><p className="text-sm text-slate-500 mb-1">Readability</p><p className="text-2xl font-bold text-slate-800">{metrics.readability}% <span className="text-lg text-slate-600">({metrics.readabilityLabel})</span></p></div>
            </div>
          </section>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleHumanize}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Wand2 className="w-5 h-5" />
            {isProcessing ? 'Processing...' : 'Humanize text'}
          </button>
          <button
            onClick={handleReset}
            disabled={isProcessing}
            className="flex items-center gap-2 px-8 py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 font-semibold rounded-xl transition-colors"
          >
            <RotateCw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
