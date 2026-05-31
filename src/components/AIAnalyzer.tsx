import { useState, useEffect, useCallback } from 'react';
import { analyzeLogs } from '../services/api';

interface AnalysisPatterns {
  connections: number;
  disconnections: number;
  server_events: number;
  messages: number;
}

interface AnalysisResponse {
  success: boolean;
  data: { totalEvents: number; timeRange: string };
  analysis: {
    summary: string;
    patterns: AnalysisPatterns;
    recommendations: string[];
  };
  llmAnalysis: {
    analysis: string;
    model: string;
    usage: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number };
  };
}

function getElapsed(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// Render **bold** inline markers
function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
      : part
  );
}

// Parse the llmAnalysis markdown into JSX
function LLMText({ text }: { text: string }) {
  const cleaned = text.replace(/\$([^$]+)\$/g, (_, m) => m); // strip $s1$ → s1
  const lines = cleaned.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.trim() === '') return;

    // Top-level bullet: "*   **Title:** body"
    if (/^\*\s{1,3}/.test(line)) {
      const content = line.replace(/^\*\s{1,3}/, '');
      nodes.push(
        <li key={i} className="flex items-start gap-2.5">
          <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shrink-0" />
          <span className="text-sm text-slate-700 leading-relaxed">{renderInline(content)}</span>
        </li>
      );
      return;
    }

    // Numbered sub-item: "    1. body"
    const numMatch = line.match(/^\s{2,}(\d+)\.\s+(.*)/);
    if (numMatch) {
      nodes.push(
        <li key={i} className="flex items-start gap-2 pl-6">
          <span className="text-[11px] font-bold text-indigo-400 shrink-0 mt-0.5">{numMatch[1]}.</span>
          <span className="text-xs text-slate-600 leading-relaxed">{renderInline(numMatch[2])}</span>
        </li>
      );
      return;
    }

    nodes.push(
      <p key={i} className="text-sm text-slate-700 leading-relaxed">{renderInline(line)}</p>
    );
  });

  return <ul className="space-y-3">{nodes}</ul>;
}

const STAT_CHIPS: { key: keyof AnalysisPatterns; label: string; color: string }[] = [
  { key: 'connections',    label: 'connected',   color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { key: 'disconnections', label: 'disconnected', color: 'bg-red-50 text-red-500 border-red-100' },
  { key: 'server_events',  label: 'srv events',  color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { key: 'messages',       label: 'messages',    color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
];

export default function AIAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [dotVisible, setDotVisible] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyzeLogs();
      setResult(res.data as AnalysisResponse);
      const now = new Date();
      setLastFetched(now);
      setDotVisible(true);
    } catch {
      setError('Could not reach the analysis endpoint. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalysis(); }, [fetchAnalysis]);

  const handleOpen = () => {
    setIsOpen((o) => !o);
    setDotVisible(false);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-20 right-5 sm:right-6 z-50 w-[calc(100vw-2.5rem)] sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 7rem)' }}
        >
          {/* gradient header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-base select-none">✨</div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">AI Activity Analyzer</p>
                  <p className="text-white/60 text-[10px] mt-0.5 font-mono">
                    {lastFetched ? `1h window · refreshed ${getElapsed(lastFetched)}` : 'analyzing…'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/15 transition-colors text-lg leading-none"
              >×</button>
            </div>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3 animate-pulse">
                {[1, 0.8, 1, 0.65, 0.9, 0.75, 1, 0.7].map((w, i) => (
                  <div key={i} className="h-2.5 bg-slate-100 rounded-full" style={{ width: `${w * 100}%` }} />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl">⚠️</div>
                <p className="text-xs text-slate-500 leading-relaxed">{error}</p>
                <button
                  onClick={fetchAnalysis}
                  className="text-xs px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium"
                >Try again</button>
              </div>
            ) : result ? (
              <div className="p-4 space-y-4">
                {/* stat chips */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-full border border-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 inline-block" />
                    {result.data.totalEvents} total
                  </span>
                  {STAT_CHIPS.map(({ key, label, color }) => (
                    <span key={key} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full border ${color}`}>
                      {result.analysis.patterns[key]} {label}
                    </span>
                  ))}
                </div>

                {/* divider + label */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">AI Analysis</span>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] text-slate-300 font-mono">{result.llmAnalysis.model}</span>
                </div>

                {/* llm markdown */}
                <LLMText text={result.llmAnalysis.analysis} />
              </div>
            ) : null}
          </div>

          {/* footer */}
          {!isLoading && (
            <div className="shrink-0 px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                {result
                  ? `${result.llmAnalysis.usage.totalTokenCount.toLocaleString()} tokens`
                  : ''}
              </span>
              <button
                onClick={fetchAnalysis}
                className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors font-medium shadow-sm"
              >
                <span className="text-sm leading-none">↻</span>
                Refresh
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={handleOpen}
        title="AI Activity Analyzer"
        className={[
          'fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50',
          'w-12 h-12 rounded-full',
          'bg-gradient-to-br from-indigo-500 to-purple-600',
          'text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
          'transition-all duration-200 flex items-center justify-center',
        ].join(' ')}
      >
        {isLoading
          ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : <span className="text-xl select-none">✨</span>
        }
        {dotVisible && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </button>
    </>
  );
}
