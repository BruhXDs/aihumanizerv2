import { useState } from 'react';
import { Wand2, Copy, RotateCw } from 'lucide-react';
import { humanizeText } from './services/textProcessor';
import { calculateReadability, type ReadabilityMetrics } from './utils/readability';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<ReadabilityMetrics | null>(null);

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
    if (outputText) {
      await navigator.clipboard.writeText(outputText);
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setMetrics(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wand2 className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-800">AI Text Humanizer</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Transform AI-generated content into natural, human-like text
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">AI Generated Text</h2>
              <span className="text-sm text-slate-500">
                {inputText.split(/\s+/).filter(w => w).length} words
              </span>
            </div>
            <textarea
              className="w-full h-96 p-4 border-2 border-slate-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 transition-colors text-slate-700"
              placeholder="Paste your AI-generated text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Humanized Text</h2>
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
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 mb-2">Processing your text...</p>
                  <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{Math.round(progress)}%</p>
                </div>
              ) : outputText ? (
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{outputText}</p>
              ) : (
                <p className="text-slate-400 italic">Your humanized text will appear here...</p>
              )}
            </div>
          </div>
        </div>

        {metrics && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Text Metrics</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-slate-500 mb-1">Words</p>
                <p className="text-2xl font-bold text-slate-800">{metrics.words}</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-slate-500 mb-1">Characters</p>
                <p className="text-2xl font-bold text-slate-800">{metrics.characters}</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm text-slate-500 mb-1">Readability</p>
                <p className="text-2xl font-bold text-slate-800">
                  {metrics.readability}% <span className="text-lg text-slate-600">({metrics.readabilityLabel})</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleHumanize}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <Wand2 className="w-5 h-5" />
            {isProcessing ? 'Processing...' : 'Humanize Text'}
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
