import { useEffect, useState } from 'react'
import { Clock3, RefreshCcw } from 'lucide-react'
import { getHistory } from '../services/api'

const riskStyles = {
  High: 'bg-rose-100 text-rose-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHistory = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getHistory()
      setHistory(response.data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to load prediction history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="space-y-6">
      <section className="glass-card animate-fade-in p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Clock3 className="h-4 w-4" />
              Prediction log
            </div>
            <h1 className="title-display mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Prediction History</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Every manual prediction is persisted in the backend database so you can review churn calls, revisit recommendations, and audit customer risk changes over time.
            </p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700">{error}</div>
      ) : null}

      <section className="glass-card animate-fade-in overflow-hidden p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <th className="px-3 py-4">Customer ID</th>
                <th className="px-3 py-4">Probability</th>
                <th className="px-3 py-4">Risk</th>
                <th className="px-3 py-4">Recommendation</th>
                <th className="px-3 py-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white/70">
              {loading ? (
                <tr>
                  <td className="px-3 py-8 text-sm text-slate-500" colSpan={5}>
                    Loading prediction history...
                  </td>
                </tr>
              ) : history.length ? (
                history.map((record) => (
                  <tr key={record.id} className="transition hover:bg-blue-50/60">
                    <td className="px-3 py-4 text-sm font-semibold text-slate-900">{record.customer_id}</td>
                    <td className="px-3 py-4 text-sm text-slate-600">{Number(record.probability).toFixed(2)}</td>
                    <td className="px-3 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskStyles[record.risk] || 'bg-slate-100 text-slate-600'}`}>
                        {record.risk}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">{record.recommendation}</td>
                    <td className="px-3 py-4 text-sm text-slate-500">{record.created_at ? new Date(record.created_at).toLocaleString() : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-8 text-sm text-slate-500" colSpan={5}>
                    No prediction records have been stored yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
