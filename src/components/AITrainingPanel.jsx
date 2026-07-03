import React, { useState, useCallback } from 'react'
import { clothingAI } from '../services/mlModel'
import LoadingSpinner from './LoadingSpinner'

export default function AITrainingPanel({ isDark }) {
  const [trainingMode, setTrainingMode] = useState('upload') // upload, view, export
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [stats, setStats] = useState(null)
  const [trainingResults, setTrainingResults] = useState(null)
  const [showResults, setShowResults] = useState(false)

  // Load stats when component mounts or when viewing training data
  React.useEffect(() => {
    if (trainingMode === 'view') {
      setStats(clothingAI.getStatistics())
    }
  }, [trainingMode])

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  // Add training data
  const handleAddTrainingData = async () => {
    if (!selectedFile || !label.trim()) {
      setMessage('❌ Please select an image and enter a label')
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const result = await clothingAI.addTrainingData(selectedFile, label.trim())
      setMessage(`✅ Added "${label}" to training data (ID: ${result.id.slice(0, 6)})`)
      setLabel('')
      setSelectedFile(null)
      setPreview('')
      setStats(clothingAI.getStatistics())
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Train the model
  const handleTrainModel = async () => {
    if (clothingAI.trainingData.length < 2) {
      setMessage(`❌ Need at least 2 samples to train (currently have ${clothingAI.trainingData.length})`)
      return
    }

    setLoading(true)
    setMessage('')
    try {
      const results = await clothingAI.trainModel()
      setTrainingResults(results)
      setShowResults(true)
      setMessage(`✅ Model trained successfully with ${results.samplesUsed} samples`)
      setTimeout(() => setShowResults(false), 5000)
    } catch (error) {
      setMessage(`❌ Error training: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Export model
  const handleExportModel = async () => {
    try {
      const modelData = await clothingAI.exportModel()
      const dataStr = JSON.stringify(modelData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `clothing-ai-model-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
      setMessage('✅ Model exported successfully')
    } catch (error) {
      setMessage(`❌ Error exporting: ${error.message}`)
    }
  }

  // Import model
  const handleImportModel = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      await clothingAI.importModel(data)
      setMessage('✅ Model imported successfully')
      setStats(clothingAI.getStatistics())
    } catch (error) {
      setMessage(`❌ Error importing: ${error.message}`)
    }
  }

  // Clear training data
  const handleClearData = () => {
    if (window.confirm('Are you sure? This will delete all training data.')) {
      clothingAI.clearTrainingData()
      setStats(null)
      setMessage('✅ Training data cleared')
    }
  }

  return (
    <div className={`rounded-[1.5rem] border ${isDark ? 'border-white/10 bg-neutral-900' : 'border-neutral-200 bg-white'} p-6 shadow-xl ${isDark ? 'shadow-black/20' : 'shadow-neutral-200/70'}`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>AI Learning System</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Train the AI model by uploading and labeling clothing images
        </p>
      </div>

      {/* Mode Selector */}
      <div className="mb-6 flex gap-2">
        {['upload', 'view', 'export'].map(mode => (
          <button
            key={mode}
            onClick={() => setTrainingMode(mode)}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              trainingMode === mode
                ? isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'
                : isDark ? 'bg-white/10 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Upload Mode */}
      {trainingMode === 'upload' && (
        <div className="space-y-4">
          <div className={`rounded-lg border-2 border-dashed ${isDark ? 'border-white/20' : 'border-neutral-300'} p-6`}>
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
                <label className={`block cursor-pointer text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Change image
                  <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2">
                <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>Click to upload image</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>
            )}
          </div>

          <div>
            <label className={`block text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'} mb-2`}>
              Label (e.g., "Blue Jeans", "White T-Shirt")
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Describe the clothing item"
              className={`w-full rounded-lg border ${isDark ? 'border-white/20 bg-white/5' : 'border-neutral-300 bg-white'} px-4 py-2 ${isDark ? 'text-white placeholder-neutral-500' : 'text-neutral-950'}`}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTrainingData()}
            />
          </div>

          <button
            onClick={handleAddTrainingData}
            disabled={loading || !selectedFile}
            className={`w-full rounded-lg px-4 py-3 font-semibold transition ${
              isDark
                ? 'bg-emerald-600 text-white disabled:opacity-50'
                : 'bg-emerald-600 text-white disabled:opacity-50'
            }`}
          >
            {loading ? 'Processing...' : 'Add to Training Data'}
          </button>

          {clothingAI.trainingData.length > 0 && (
            <button
              onClick={handleTrainModel}
              disabled={loading || clothingAI.trainingData.length < 2}
              className={`w-full rounded-lg px-4 py-3 font-semibold transition ${
                isDark
                  ? 'bg-blue-600 text-white disabled:opacity-50'
                  : 'bg-blue-600 text-white disabled:opacity-50'
              }`}
            >
              {loading ? 'Training...' : `Train Model (${clothingAI.trainingData.length} samples)`}
            </button>
          )}
        </div>
      )}

      {/* View Mode */}
      {trainingMode === 'view' && stats && (
        <div className="space-y-4">
          <div className={`rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-4`}>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{stats.totalSamples}</p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Total Samples</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.uniqueLabels}</p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Unique Labels</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{stats.modelStatus}</p>
                <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Model Status</p>
              </div>
            </div>
          </div>

          {stats.labels.length > 0 && (
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'} mb-2`}>Labels Learned:</p>
              <div className="flex flex-wrap gap-2">
                {stats.labels.map(label => (
                  <span key={label} className={`rounded-full px-3 py-1 text-sm ${isDark ? 'bg-white/10 text-neutral-300' : 'bg-neutral-100 text-neutral-700'}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {stats.trainingData.length > 0 && (
            <div>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'} mb-3`}>Training Samples:</p>
              <div className={`max-h-64 space-y-2 overflow-y-auto rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-3`}>
                {stats.trainingData.slice(0, 10).map((item, idx) => (
                  <div key={item.id} className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {idx + 1}. <strong>{item.userLabel}</strong> - {item.type} ({item.color})
                  </div>
                ))}
                {stats.trainingData.length > 10 && (
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    ...and {stats.trainingData.length - 10} more
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleClearData}
            className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
          >
            Clear All Training Data
          </button>
        </div>
      )}

      {/* Export Mode */}
      {trainingMode === 'export' && (
        <div className="space-y-4">
          <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Export your trained model to share or back up, or import a pre-trained model.
          </p>

          <button
            onClick={handleExportModel}
            disabled={clothingAI.trainingData.length === 0}
            className={`w-full rounded-lg px-4 py-3 font-semibold transition ${
              isDark
                ? 'bg-green-600 text-white disabled:opacity-50'
                : 'bg-green-600 text-white disabled:opacity-50'
            }`}
          >
            📥 Export Model as JSON
          </button>

          <div className={`rounded-lg border-2 border-dashed ${isDark ? 'border-white/20' : 'border-neutral-300'} p-6`}>
            <label className="flex cursor-pointer flex-col items-center gap-2">
              <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>Import Model</span>
              <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Click to upload a model file</span>
              <input type="file" accept=".json" onChange={handleImportModel} className="sr-only" />
            </label>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`mt-4 rounded-lg p-3 text-sm ${
          message.includes('✅')
            ? isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
            : isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Training Results */}
      {showResults && trainingResults && (
        <div className={`mt-4 rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'} p-4`}>
          <p className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>🎓 Training Complete!</p>
          <p className={`mt-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
            Accuracy: <strong>{(parseFloat(trainingResults.accuracy) * 100).toFixed(1)}%</strong> on {trainingResults.samplesUsed} samples
          </p>
        </div>
      )}

      {loading && <div className="mt-4 flex justify-center"><LoadingSpinner /></div>}
    </div>
  )
}
