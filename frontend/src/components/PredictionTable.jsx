const riskStyles = {
  High: 'bg-rose-100 text-rose-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-emerald-100 text-emerald-700',
}

export default function PredictionTable({ rows = [] }) {
  return (
    <section className="glass-card animate-fade-in overflow-hidden p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="title-display text-lg font-bold text-slate-950">High Risk Customers</h3>
          <p className="mt-1 text-sm text-slate-500">Customers with the highest churn probabilities appear here first.</p>
        </div>
        <p className="text-sm font-medium text-slate-500">Top {Math.min(rows.length, 10)} results</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <th className="px-3 py-4">Customer ID</th>
              <th className="px-3 py-4">Probability</th>
              <th className="px-3 py-4">Risk</th>
              <th className="px-3 py-4">Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/70">
            {rows.length ? (
              rows.map((row) => (
                <tr key={row.customer_id} className="transition hover:bg-blue-50/60">
                  <td className="px-3 py-4 text-sm font-semibold text-slate-900">{row.customer_id}</td>
                  <td className="px-3 py-4 text-sm text-slate-600">{Number(row.probability).toFixed(2)}</td>
                  <td className="px-3 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${riskStyles[row.risk] || 'bg-slate-100 text-slate-600'}`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">{row.recommendation}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-8 text-sm text-slate-500" colSpan={4}>
                  No high risk customers yet. Run predictions after training the model.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
