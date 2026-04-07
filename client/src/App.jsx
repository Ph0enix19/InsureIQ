import { useState } from 'react';
import axios from 'axios';
import { FileText, Activity, AlertTriangle, Clock, MapPin, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';

function App() {
  const [claimText, setClaimText] = useState('My vehicle was involved in a collision on the highway near Subang on March 15th. The repair estimate from the workshop is RM8,500. The other driver fled the scene.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeClaim = async () => {
    if (!claimText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:3000/api/analyze', { claimText });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze claim. Ensure backend services are running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score <= 3) return 'bg-emerald-500';
    if (score <= 6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Motor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Travel': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Medical': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Home': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-500/10 mb-2">
            <ShieldCheck className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
            InsureIQ
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            AI-powered claims processing assistant. Instant analysis, intelligent routing, and risk assessment via LLMs.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Panel */}
          <div className="glass-panel p-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Claim Details
            </h2>
            <textarea
              className="flex-grow w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none mb-6 min-h-[300px]"
              placeholder="Describe your claim here..."
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
            />
            <button
              onClick={analyzeClaim}
              disabled={loading || !claimText.trim()}
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Analyse Claim
                </>
              )}
            </button>
          </div>

          {/* Results Panel */}
          <div className="glass-panel p-6 relative overflow-hidden min-h-[500px]">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 z-10 glass-panel border-none flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-400 rounded-full animate-spin" />
                <p className="text-teal-400 animate-pulse font-medium tracking-wider uppercase text-sm">
                  Processing via ML models...
                </p>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <Activity className="w-16 h-16 opacity-20" />
                <p>Submit a claim to view AI analysis</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* Header Stats */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/50 pb-6">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Detected Class</p>
                    <span className={`px-3 py-1 text-sm font-medium border rounded-full ${getTypeColor(result.claimType)}`}>
                      {result.claimType} {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Decision</p>
                    <span className={`px-4 py-1 text-sm font-bold rounded-full ${
                      result.recommendation === 'APPROVE' ? 'bg-emerald-500/20 text-emerald-400' :
                      result.recommendation === 'ESCALATE' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-rose-500/20 text-rose-400'
                    }`}>
                      {result.recommendation}
                    </span>
                  </div>
                </div>

                {/* Risk Score */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-sm font-medium text-slate-300">Risk Assessment</h3>
                    <span className="text-2xl font-bold">{result.riskScore}<span className="text-sm text-slate-500">/10</span></span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${getRiskColor(result.riskScore)}`}
                      style={{ width: `${(result.riskScore / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Extracted Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="text-sm font-medium">{result.extractedInfo?.date || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Amount</p>
                      <p className="text-sm font-medium">{result.extractedInfo?.amount || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm font-medium">{result.extractedInfo?.location || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Flags */}
                {result.riskFlags && result.riskFlags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3">Red Flags Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.riskFlags.map((flag, idx) => (
                        <span key={idx} className="px-3 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Claim Summary</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {/* Next Steps */}
                {result.nextSteps && result.nextSteps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3">Recommended Actions</h3>
                    <ul className="space-y-2">
                      {result.nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                          <ArrowRight className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
