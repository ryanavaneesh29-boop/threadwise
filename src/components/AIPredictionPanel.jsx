import React, { useState } from 'react'
import { clothingAI } from '../services/mlModel'
import LoadingSpinner from './LoadingSpinner'

export default function AIPredictionPanel({ isDark }) {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [error, setError] = useState('')

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
      setPrediction(null)
      setError('')
    }
  }

  // Make prediction
  const handlePredict = async () => {
    if (!uploadedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError('')
    setPrediction(null)

    try {
      const result = await clothingAI.predictClothing(uploadedFile)
      setPrediction(result)
    } catch (err) {
      setError(`Error making prediction: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`rounded-[1.5rem] border ${isDark ? 'border-white/10 bg-neutral-900' : 'border-neutral-200 bg-white'} p-6 shadow-xl ${isDark ? 'shadow-black/20' : 'shadow-neutral-200/70'}`}>
      <div className="mb-6">
        <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>AI Predictions</h2>
        <p className={`mt-2 text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Use the trained model to analyze clothing and get recommendations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>Upload Clothing Image</h3>
          
          <div className={`rounded-lg border-2 border-dashed ${isDark ? 'border-white/20' : 'border-neutral-300'} p-6`}>
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="h-48 w-full rounded-lg object-cover" />
                <label className={`block cursor-pointer text-center text-sm font-medium transition ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-700'
                }`}>
                  Change image
                  <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                </label>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2">
                <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>Click to upload</span>
                <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>or drag and drop</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>
            )}
          </div>

          <button
            onClick={handlePredict}
            disabled={loading || !uploadedFile}
            className={`w-full rounded-lg px-4 py-3 font-semibold transition ${
              isDark
                ? 'bg-emerald-600 text-white disabled:opacity-50'
                : 'bg-emerald-600 text-white disabled:opacity-50'
            }`}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Clothing'}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>Analysis Results</h3>
          
          {loading && (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className={`rounded-lg p-4 text-sm ${
              isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-50 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {prediction && !loading && (
            <div className="space-y-4">
              {/* Clothing Analysis */}
              <div className={`rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-4`}>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'} mb-3`}>Detected Clothing:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Type</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>{prediction.analysis.type}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Color</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>{prediction.analysis.color}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Style</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>{prediction.analysis.style}</p>
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Pattern</p>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'}`}>{prediction.analysis.pattern}</p>
                  </div>
                </div>
                <p className={`mt-3 text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Confidence: {(parseFloat(prediction.confidence) * 100).toFixed(1)}%
                </p>
              </div>

              {/* Similar from Training */}
              {prediction.similarFromTraining?.length > 0 && (
                <div className={`rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-4`}>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'} mb-3`}>Similar Items from Training:</h4>
                  <div className="space-y-2">
                    {prediction.similarFromTraining.map((item) => (
                      <div key={item.id} className={`rounded px-3 py-2 text-sm ${isDark ? 'bg-white/10' : 'bg-white'}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-neutral-950'}`}>{item.type}</p>
                            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{item.color} - {item.style}</p>
                          </div>
                          <p className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            {(parseFloat(item.similarity) * 100).toFixed(0)}% match
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {prediction.recommendations && (
                <div className={`rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-4`}>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-950'} mb-3`}>Recommendations:</h4>
                  <div className="space-y-2">
                    {prediction.recommendations.tops?.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>👕 Tops</p>
                        <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {prediction.recommendations.tops.map(t => t.userLabel).join(', ')}
                        </p>
                      </div>
                    )}
                    {prediction.recommendations.bottoms?.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>👖 Bottoms</p>
                        <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {prediction.recommendations.bottoms.map(b => b.userLabel).join(', ')}
                        </p>
                      </div>
                    )}
                    {prediction.recommendations.shoes?.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>👟 Shoes</p>
                        <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {prediction.recommendations.shoes.map(s => s.userLabel).join(', ')}
                        </p>
                      </div>
                    )}
                    {prediction.recommendations.accessories?.length > 0 && (
                      <div>
                        <p className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>✨ Accessories</p>
                        <p className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {prediction.recommendations.accessories.map(a => a.userLabel).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !prediction && !error && (
            <div className={`rounded-lg ${isDark ? 'bg-white/5' : 'bg-neutral-50'} p-6 text-center`}>
              <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Upload an image and click "Analyze Clothing" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
