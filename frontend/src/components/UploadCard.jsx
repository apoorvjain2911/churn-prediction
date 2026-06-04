import { CloudUpload, Loader2, Rocket, Sparkles } from 'lucide-react'

export default function UploadCard({
  fileName,
  onFileChange,
  onUpload,
  onTrain,
  onGenerateInsights,
  uploadStatus,
  uploadRows,
  trainingMetrics,
  loading,
}) {
  const hasFile = Boolean(fileName)

  return (
    <section className="glass-card animate-fade-in overflow-hidden p-6 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            Data onboarding
          </div>
          <div>
            <h2 className="title-display text-2xl font-bold text-slate-950 sm:text-3xl">Upload your customer CSV and train the churn model</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Drop in a production export or a telecom-style churn dataset. The backend validates the schema, stores the latest upload, trains the model, and powers the dashboard analytics.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem] lg:grid-cols-1">
          <button
            type="button"
            onClick={() => document.getElementById('csv-upload-input')?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <CloudUpload className="h-4 w-4" />
            Select CSV
          </button>
          <button
            type="button"
            onClick={onUpload}
            disabled={!hasFile || loading.uploading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading.uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
            Upload Dataset
          </button>
          <button
            type="button"
            onClick={onTrain}
            disabled={loading.training}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading.training ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
            Train Model
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <label
          htmlFor="csv-upload-input"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/70 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
        >
          <input id="csv-upload-input" type="file" accept=".csv" onChange={onFileChange} className="hidden" />
          <CloudUpload className="h-12 w-12 text-blue-500 transition group-hover:scale-105" />
          <p className="mt-4 text-base font-semibold text-slate-900">Drag and drop your CSV here</p>
          <p className="mt-1 text-sm text-slate-500">or click to browse from your device</p>
          <p className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {fileName || 'No file selected'}
          </p>
        </label>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Upload status</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{uploadStatus || 'Awaiting upload'}</p>
            <p className="mt-2 text-sm text-slate-500">{uploadRows ? `${uploadRows} customer rows validated successfully.` : 'The latest uploaded dataset will power the next model run.'}</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Workflow</p>
            <ol className="mt-3 space-y-3 text-sm text-slate-600">
              <li>1. Upload the customer CSV.</li>
              <li>2. Train the model on the latest dataset.</li>
              <li>3. Generate dashboard analytics.</li>
            </ol>
          </div>

          <button
            type="button"
            onClick={onGenerateInsights}
            disabled={loading.insights}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading.insights ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Insights
          </button>
        </div>
      </div>

      {trainingMetrics ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ['Accuracy', trainingMetrics.accuracy],
            ['Precision', trainingMetrics.precision],
            ['Recall', trainingMetrics.recall],
            ['F1 Score', trainingMetrics.f1],
            ['ROC AUC', trainingMetrics.roc_auc],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
