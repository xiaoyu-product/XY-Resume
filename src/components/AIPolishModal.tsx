import { useState } from 'react'
import { X, Sparkles, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import { polishResumeSections, AIResponse } from '@/services/aiService'

export function AIPolishModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { resume, updatePersonalInfo, updateExperience, updateProject } = useResumeStore()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AIResponse | null>(null)
  const [copied, setCopied] = useState(false)
  const [showApplyButton, setShowApplyButton] = useState(false)

  const handlePolish = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await polishResumeSections()
      setResult(response)
      
      if (response.success && response.data) {
        setShowApplyButton(true)
      }
    } catch (error) {
      setResult({ success: false, error: '操作失败，请重试' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyPolish = () => {
    if (!result?.data?.polished) return

    const polished = result.data.polished

    const summaryMatch = polished.match(/个人简介:\s*([\s\S]*?)(?=\n工作经历|\n项目经验|\n$)/)
    if (summaryMatch && resume.personalInfo) {
      updatePersonalInfo({ summary: summaryMatch[1].trim() })
    }

    const experienceMatches = polished.match(/工作经历\[([^\]]+)\]:\s*([\s\S]*?)(?=\n工作经历|\n项目经验|\n$)/g) || []
    experienceMatches.forEach((match, index) => {
      const descMatch = match.match(/:\s*([\s\S]*)$/)
      
      if (descMatch && resume.experience[index]) {
        updateExperience(resume.experience[index].id, { description: descMatch[1].trim() })
      }
    })

    const projectMatches = polished.match(/项目经验\[([^\]]+)\]:\s*([\s\S]*?)(?=\n工作经历|\n项目经验|\n$)/g) || []
    projectMatches.forEach((match, index) => {
      const descMatch = match.match(/:\s*([\s\S]*)$/)
      
      if (descMatch && resume.projects[index]) {
        updateProject(resume.projects[index].id, { description: descMatch[1].trim() })
      }
    })

    setShowApplyButton(false)
    onClose()
  }

  const handleCopy = () => {
    if (result?.data?.polished) {
      navigator.clipboard.writeText(result.data.polished)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">AI 智能润色</h3>
              <p className="text-sm text-slate-500">让您的简历更具竞争力</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!result ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-amber-500" />
              </div>
              <p className="text-slate-600 mb-2">AI 智能润色将帮助您：</p>
              <ul className="text-left space-y-2 text-sm text-slate-500 max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  优化个人简介，突出核心优势
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  工作经历量化成果展示
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  项目经验突出专业技能
                </li>
              </ul>

              {!resume.personalInfo.summary && resume.experience.length === 0 && resume.projects.length === 0 && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    您的简历还没有可润色的内容，请先填写个人简介、工作经历或项目经验
                  </p>
                </div>
              )}
            </div>
          ) : result.success ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">润色完成！</span>
              </div>
              
              <div className="relative">
                <pre className="whitespace-pre-wrap p-4 bg-slate-50 rounded-lg text-sm text-slate-700 max-h-64 overflow-y-auto">
                  {result.data?.polished}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow hover:bg-slate-50 transition-colors"
                  title="复制内容"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              </div>

              {result.data?.suggestions && result.data.suggestions.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 mb-2">优化建议：</p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {result.data.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-400">-</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-slate-600 mb-2">{result.error}</p>
              <p className="text-sm text-slate-400">请检查 API 配置或稍后重试</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          {!result ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handlePolish}
                disabled={isLoading || (!resume.personalInfo.summary && resume.experience.length === 0 && resume.projects.length === 0)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    润色中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    开始润色
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setResult(null)
                  setShowApplyButton(false)
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                重新润色
              </button>
              {showApplyButton && result.success && (
                <button
                  onClick={handleApplyPolish}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  应用到简历
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
