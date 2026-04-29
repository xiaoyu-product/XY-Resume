import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Download,
  Wand2,
  Eye,
} from 'lucide-react'
import { PersonalInfoEditor } from '@/components/editors/PersonalInfoEditor'
import { EducationEditor } from '@/components/editors/EducationEditor'
import { ExperienceEditor } from '@/components/editors/ExperienceEditor'
import { ProjectEditor } from '@/components/editors/ProjectEditor'
import { SkillEditor } from '@/components/editors/SkillEditor'
import { ResumePreview } from '@/components/preview/ResumePreview'
import { TemplateSelector } from '@/components/TemplateSelector'
import { ExportDialog } from '@/components/ExportDialog'
import { ResumeImporter } from '@/components/ResumeImporter'
import { AIPolishModal } from '@/components/AIPolishModal'

export function WorkbenchPage() {
  const { activeSection, setActiveSection, resume, currentTemplate, setTemplate } = useResumeStore()
  const [showPreview, setShowPreview] = useState(true)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [showAIPolishModal, setShowAIPolishModal] = useState(false)

  const sections = [
    { id: 'personalInfo', icon: User, label: '个人信息' },
    { id: 'education', icon: GraduationCap, label: '教育经历' },
    { id: 'experience', icon: Briefcase, label: '工作经历' },
    { id: 'projects', icon: FolderKanban, label: '项目经验' },
    { id: 'skills', icon: Wrench, label: '技能特长' },
  ]

  const renderEditor = () => {
    switch (activeSection) {
      case 'personalInfo':
        return <PersonalInfoEditor />
      case 'education':
        return <EducationEditor />
      case 'experience':
        return <ExperienceEditor />
      case 'projects':
        return <ProjectEditor />
      case 'skills':
        return <SkillEditor />
      default:
        return <PersonalInfoEditor />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">XY Resume</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-sm text-slate-500">
            {resume.personalInfo.name || '未命名简历'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ResumeImporter />
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            {currentTemplate.name}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {showPreview ? (
              <>
                <ChevronRight className="w-4 h-4" />
                隐藏预览
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                显示预览
              </>
            )}
          </button>
          <button
            onClick={() => setShowExportDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
          <nav className="flex-1 py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button onClick={() => setShowAIPolishModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg text-sm font-medium hover:from-amber-100 hover:to-orange-100 transition-colors">
              <Wand2 className="w-4 h-4" />
              AI 润色
            </button>
          </div>
        </aside>

        <main className="flex-1 flex overflow-hidden">
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-auto p-6 bg-white`}>
            {renderEditor()}
          </div>

          {showPreview && (
            <div className="w-1/2 bg-slate-100 overflow-auto p-6">
              <ResumePreview />
            </div>
          )}
        </main>
      </div>

      {showTemplateSelector && (
        <TemplateSelector onClose={() => setShowTemplateSelector(false)} onSelect={setTemplate} />
      )}

      {showExportDialog && (
        <ExportDialog onClose={() => setShowExportDialog(false)} />
      )}

      <AIPolishModal isOpen={showAIPolishModal} onClose={() => setShowAIPolishModal(false)} />
    </div>
  )
}