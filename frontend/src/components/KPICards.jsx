import { ArrowDownRight, Banknote, Users, UserX } from 'lucide-react'

const cards = [
  {
    title: 'Total Customers',
    icon: Users,
    key: 'total_customers',
  },
  {
    title: 'Predicted Churn',
    icon: UserX,
    key: 'predicted_churn',
  },
  {
    title: 'Churn Rate',
    icon: ArrowDownRight,
    key: 'churn_rate',
  },
  {
    title: 'Avg Monthly Charges',
    icon: Banknote,
    key: 'average_monthly_charges',
  },
]

const formatValue = (title, value) => {
  if (value === null || value === undefined) return '—'
  if (title === 'Churn Rate') return `${value}%`
  if (title === 'Avg Monthly Charges') return `$${Number(value).toFixed(2)}`
  return Number(value).toLocaleString()
}

export default function KPICards({ summary }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, icon: Icon, key }) => (
        <article key={title} className="glass-card animate-fade-in p-5 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_-24px_rgba(37,99,235,0.3)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{formatValue(title, summary?.[key])}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
