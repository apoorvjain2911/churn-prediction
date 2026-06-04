import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const BLUE_PALETTE = ['#2563eb', '#60a5fa', '#93c5fd', '#dbeafe', '#1d4ed8']

const EmptyState = ({ title, description }) => (
  <div className="flex h-full min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-center">
    <div className="max-w-sm px-6 py-10">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  </div>
)

function ChartCard({ title, children }) {
  return (
    <article className="glass-card animate-fade-in p-5">
      <h3 className="title-display text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-4 h-[320px]">{children}</div>
    </article>
  )
}

export default function Charts({ charts, featureImportance }) {
  const pieData = charts?.pie || []
  const contractData = charts?.contract || []
  const tenureData = charts?.tenure || []
  const featureData = featureImportance || []

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <ChartCard title="Churn vs Retained">
        {pieData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={80} outerRadius={115} paddingAngle={5}>
                {pieData.map((entry, index) => (
                  <Cell key={`pie-${entry.name}`} fill={BLUE_PALETTE[index % BLUE_PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="No churn analytics yet" description="Generate insights after training to populate the chart." />
        )}
      </ChartCard>

      <ChartCard title="Contract Type vs Churn">
        {contractData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contractData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="Contract analytics unavailable" description="The uploaded dataset must contain a Contract column." />
        )}
      </ChartCard>

      <ChartCard title="Feature Importance">
        {featureData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[...featureData].reverse()} layout="vertical" margin={{ top: 10, right: 16, left: 40, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="feature" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="importance" fill="#60a5fa" radius={[0, 12, 12, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="Train the model to see feature importance" description="The backend returns the top feature importances after each training run." />
        )}
      </ChartCard>

      <ChartCard title="Tenure Distribution">
        {tenureData.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tenureData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState title="Tenure trend unavailable" description="The dashboard needs a tenure column to render the line chart." />
        )}
      </ChartCard>
    </section>
  )
}
