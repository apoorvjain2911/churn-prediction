import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, PlayCircle, ShieldCheck } from 'lucide-react'
import UploadCard from '../components/UploadCard'
import KPICards from '../components/KPICards'
import Charts from '../components/Charts'
import PredictionTable from '../components/PredictionTable'
import {
  getHistory,
  predictBatch,
  trainModel,
  uploadDataset,
} from '../services/api'

const initialLoading = {
  uploading: false,
  training: false,
  insights: false,
}

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadRows, setUploadRows] = useState(0)
  const [summary, setSummary] = useState(null)
  const [trainingMetrics, setTrainingMetrics] = useState(null)
  const [featureImportance, setFeatureImportance] = useState([])
  const [historyPreview, setHistoryPreview] = useState([])
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState('')

  const latestHistory = useMemo(() => {
    return Array.isArray(historyPreview)
      ? historyPreview.slice(0, 5)
      : []
  }, [historyPreview])

  useEffect(() => {
    refreshHistory()
  }, [])

  const refreshHistory = async () => {
    try {
      const response = await getHistory()

      console.log('History Response:', response.data)

      if (Array.isArray(response.data)) {
        setHistoryPreview(response.data)
      } else if (Array.isArray(response.data?.history)) {
        setHistoryPreview(response.data.history)
      } else {
        setHistoryPreview([])
      }
    } catch (err) {
      console.log(err)
      setHistoryPreview([])
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)
    setUploadStatus(file ? `Selected ${file.name}` : '')
    setError('')
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Choose a CSV file before uploading.')
      return
    }

    setLoading((state) => ({
      ...state,
      uploading: true,
    }))

    setError('')

    try {
      const response = await uploadDataset(selectedFile)
      setUploadRows(response.data.rows)
      setUploadStatus('Upload completed successfully.')
      await refreshHistory()
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          'Unable to upload the dataset.'
      )
    } finally {
      setLoading((state) => ({
        ...state,
        uploading: false,
      }))
    }
  }

  const handleTrain = async () => {
    setLoading((state) => ({
      ...state,
      training: true,
    }))

    setError('')

    try {
      const response = await trainModel()
      setTrainingMetrics(response.data)
      setFeatureImportance(
        response.data.feature_importance || []
      )
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          'Unable to train the model. Upload a valid CSV first.'
      )
    } finally {
      setLoading((state) => ({
        ...state,
        training: false,
      }))
    }
  }

  const handleGenerateInsights = async () => {
    setLoading((state) => ({
      ...state,
      insights: true,
    }))

    setError('')

    try {
      const response = await predictBatch()

      setSummary(response.data)

      setFeatureImportance(
        response.data.feature_importance ||
          featureImportance
      )

      await refreshHistory()
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          'Unable to generate dashboard insights. Train the model first.'
      )
    } finally {
      setLoading((state) => ({
        ...state,
        insights: false,
      }))
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            AI Customer Retention Command Center
          </div>

          <div className="space-y-4">
            <h1 className="title-display max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              AI Customer Churn Prediction Dashboard
            </h1>

            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Upload a customer CSV, train the Random
              Forest churn model, and surface risk
              scores, retention actions, and operational
              analytics in one production-grade
              dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              React 19
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              FastAPI
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              RandomForestClassifier
            </span>
            <span className="rounded-full bg-white px-4 py-2 shadow-sm">
              Deploy-ready
            </span>
          </div>
        </div>

        <div className="glass-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                System status
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-950">
                Live dashboard pipeline
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Upload, train, and generate insights
                from the latest dataset.
              </p>
            </div>

            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <PlayCircle className="h-6 w-6" />
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-rose-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <UploadCard
        fileName={selectedFile?.name || ''}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        onTrain={handleTrain}
        onGenerateInsights={handleGenerateInsights}
        uploadStatus={uploadStatus}
        uploadRows={uploadRows}
        trainingMetrics={trainingMetrics}
        loading={loading}
      />

      <KPICards summary={summary} />

      <Charts
        charts={{
          pie: summary?.pie_data,
          contract: summary?.contract_churn_data,
          tenure: summary?.tenure_distribution,
        }}
        featureImportance={featureImportance}
      />

      <PredictionTable
        rows={summary?.high_risk_customers || []}
      />

      <section className="glass-card animate-fade-in p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="title-display text-lg font-bold text-slate-950">
              Recent Prediction Activity
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              History entries saved by the backend.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {latestHistory.length > 0 ? (
            latestHistory.map((record, index) => (
              <div
                key={record?.id || index}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {record.customer_id}
                    </p>

                    <p className="text-sm text-slate-500">
                      {record.recommendation}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {Number(
                        record.probability || 0
                      ).toFixed(2)}
                    </p>

                    <p className="text-sm text-slate-500">
                      {record.risk} risk
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No prediction history available.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}