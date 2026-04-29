import { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import { parseResumeFile, ParsedResume } from '@/utils/resumeParser'
import { DEFAULT_RESUME } from '@/types/resume'

export function ResumeImporter() {
  const { setResume } = useResumeStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [result, setResult] = useState<ParsedResume | null>(null)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const parsed = await parseResumeFile(file)
      setResult(parsed)
    } catch (err) {
      setError('解析简历失败，请确保文件格式正确')
      console.error('Resume parsing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyResume = () => {
    if (!result) return

    const newResume = {
      ...DEFAULT_RESUME,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      personalInfo: {
        ...DEFAULT_RESUME.personalInfo,
        name: result.name || '',
        title: result.title || '',
        email: result.email || '',
        phone: result.phone || '',
        location: result.location || '',
        summary: result.summary || '',
      },
      education: result.education?.map((edu, index) => ({
        ...DEFAULT_RESUME.education[0],
        id: `edu-${Date.now()}-${index}`,
        school: edu.school || '',
        degree: edu.degree || '',
        major: edu.major || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        description: edu.description || '',
      })) || [],
      experience: result.experience?.map((exp, index) => ({
        ...DEFAULT_RESUME.experience[0],
        id: `exp-${Date.now()}-${index}`,
        company: exp.company || '',
        position: exp.position || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || '',
      })) || [],
      skills: result.skills?.map((skill, index) => ({
        id: `skill-${Date.now()}-${index}`,
        name: skill,
        level: 'intermediate' as const,
      })) || [],
    }

    setResume(newResume)
    setIsOpen(false)
    setResult(null)
  }

  const hasData = result && (
    result.name || result.title || result.email || result.phone || 
    result.location || result.summary || result.education?.length || 
    result.experience?.length || result.skills?.length
  )

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Upload className="w-4 h-4" />
        导入简历
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">导入简历</h3>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setResult(null)
                  setError('')
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {!result ? (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-indigo-600" />
                </div>
                <p className="text-slate-600 mb-4">上传您的简历文件，系统将自动提取信息</p>
                <p className="text-sm text-slate-400 mb-6">支持 PDF 和 DOCX 格式</p>
                
                <label className="block w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-indigo-600">正在解析...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5 text-slate-400" />
                      <span className="text-slate-600">点击或拖拽上传文件</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {error && (
                  <p className="mt-4 text-red-500 text-sm">{error}</p>
                )}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">简历解析成功！</span>
                </div>

                {result.name && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">姓名</span>
                    <p className="text-slate-900">{result.name}</p>
                  </div>
                )}
                {result.title && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">职位</span>
                    <p className="text-slate-900">{result.title}</p>
                  </div>
                )}
                {result.email && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">邮箱</span>
                    <p className="text-slate-900">{result.email}</p>
                  </div>
                )}
                {result.phone && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">电话</span>
                    <p className="text-slate-900">{result.phone}</p>
                  </div>
                )}
                {result.location && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">所在地</span>
                    <p className="text-slate-900">{result.location}</p>
                  </div>
                )}
                {result.summary && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">个人简介</span>
                    <p className="text-slate-900 text-sm">{result.summary}</p>
                  </div>
                )}
                {result.education && result.education.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">教育经历 ({result.education.length})</span>
                    {result.education.map((edu, index) => (
                      <div key={index} className="mt-2 text-sm text-slate-700">
                        <p>{edu.school}</p>
                        <p className="text-slate-500">{edu.degree} | {edu.major}</p>
                        <p className="text-slate-400 text-xs">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.experience && result.experience.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">工作经历 ({result.experience.length})</span>
                    {result.experience.map((exp, index) => (
                      <div key={index} className="mt-2 text-sm text-slate-700">
                        <p>{exp.company}</p>
                        <p className="text-slate-500">{exp.position}</p>
                        <p className="text-slate-400 text-xs">{exp.startDate} - {exp.endDate || '至今'}</p>
                      </div>
                    ))}
                  </div>
                )}
                {result.skills && result.skills.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-500">技能 ({result.skills.length})</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.skills.slice(0, 10).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {result.skills.length > 10 && (
                        <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded">
                          +{result.skills.length - 10}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {!hasData && (
                  <div className="text-center py-8 text-slate-400">
                    <p>未从简历中提取到信息</p>
                    <p className="text-sm mt-1">请尝试其他简历文件</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setResult(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    重新上传
                  </button>
                  {hasData && (
                    <button
                      onClick={handleApplyResume}
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      应用到简历
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
