import { useResumeStore } from '@/store/resumeStore'
import { X, FileText, FileDown } from 'lucide-react'

interface ExportDialogProps {
  onClose: () => void
}

export function ExportDialog({ onClose }: ExportDialogProps) {
  const { resume } = useResumeStore()

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resume.personalInfo.name || 'Resume'}</title>
          <style>
            @page { size: A4; margin: 2cm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 210mm; margin: 0 auto; }
            h1 { color: #4f46e5; margin-bottom: 0.5rem; }
            h2 { color: #1f2937; font-size: 1.1rem; margin-top: 1.5rem; margin-bottom: 0.5rem; }
            .contact { color: #6b7280; font-size: 0.9rem; margin-bottom: 1rem; }
            .section { margin-bottom: 1rem; }
            .item-title { font-weight: 600; color: #1f2937; }
            .item-subtitle { color: #4f46e5; font-size: 0.9rem; }
            .item-date { color: #9ca3af; font-size: 0.85rem; }
            .item-desc { color: #4b5563; font-size: 0.9rem; line-height: 1.5; }
            .skills { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
            .skill-item { display: flex; justify-content: space-between; font-size: 0.9rem; }
            .tag { display: inline-block; padding: 0.2rem 0.5rem; background: #eef2ff; color: #4f46e5; border-radius: 4px; font-size: 0.8rem; margin-right: 0.3rem; }
          </style>
        </head>
        <body>
          <h1>${resume.personalInfo.name || '您的姓名'}</h1>
          <p class="contact">${resume.personalInfo.title || '您的职位'} | ${resume.personalInfo.email || ''} | ${resume.personalInfo.phone || ''} | ${resume.personalInfo.location || ''}</p>
          
          ${resume.personalInfo.summary ? `<h2>个人简介</h2><p class="item-desc">${resume.personalInfo.summary}</p>` : ''}
          
          ${resume.experience.length > 0 ? `<h2>工作经历</h2>${resume.experience.map(e => `<div class="section"><div class="item-title">${e.company}</div><div class="item-subtitle">${e.position}</div><div class="item-date">${e.startDate} - ${e.endDate || '至今'}</div>${e.description ? `<p class="item-desc">${e.description}</p>` : ''}</div>`).join('')}` : ''}
          
          ${resume.education.length > 0 ? `<h2>教育背景</h2>${resume.education.map(e => `<div class="section"><div class="item-title">${e.school}</div><div class="item-subtitle">${e.degree} · ${e.major}</div><div class="item-date">${e.startDate} - ${e.endDate}</div>${e.description ? `<p class="item-desc">${e.description}</p>` : ''}</div>`).join('')}` : ''}
          
          ${resume.projects.length > 0 ? `<h2>项目经验</h2>${resume.projects.map(p => `<div class="section"><div class="item-title">${p.name}</div><div class="item-subtitle">${p.role}</div><div class="item-date">${p.startDate} - ${p.endDate || '至今'}</div>${p.description ? `<p class="item-desc">${p.description}</p>` : ''}${p.technologies.length > 0 ? `<div>${p.technologies.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}</div>`).join('')}` : ''}
          
          ${resume.skills.length > 0 ? `<h2>专业技能</h2><div class="skills">${resume.skills.map(s => `<div class="skill-item"><span>${s.name}</span><span>${s.level === 'beginner' ? '入门' : s.level === 'intermediate' ? '熟练' : s.level === 'advanced' ? '精通' : '专家'}</span></div>`).join('')}</div>` : ''}
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
    onClose()
  }

  const handleExportMarkdown = () => {
    const mdContent = `# ${resume.personalInfo.name || '您的姓名'}

${resume.personalInfo.title || '您的职位'} | ${resume.personalInfo.email || ''} | ${resume.personalInfo.phone || ''} | ${resume.personalInfo.location || ''}

---

## 个人简介

${resume.personalInfo.summary || ''}

---

## 工作经历

${resume.experience.map(e => `### ${e.company}

**${e.position}** | ${e.startDate} - ${e.endDate || '至今'}

${e.description || ''}

`).join('')}

---

## 教育背景

${resume.education.map(e => `### ${e.school}

**${e.degree} · ${e.major}** | ${e.startDate} - ${e.endDate}

${e.description || ''}

`).join('')}

---

## 项目经验

${resume.projects.map(p => `### ${p.name}

**${p.role}** | ${p.startDate} - ${p.endDate || '至今'}

${p.description || ''}

**技术栈:** ${p.technologies.join(', ')}

`).join('')}

---

## 专业技能

${resume.skills.map(s => `- ${s.name}: ${s.level === 'beginner' ? '入门' : s.level === 'intermediate' ? '熟练' : s.level === 'advanced' ? '精通' : '专家'}`).join('\n')}
`

    const blob = new Blob([mdContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.personalInfo.name || 'resume'}.md`
    a.click()
    URL.revokeObjectURL(url)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">导出简历</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-slate-900">导出为 PDF</div>
              <div className="text-sm text-slate-500">适合打印和投递</div>
            </div>
          </button>
          <button
            onClick={handleExportMarkdown}
            className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileDown className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-slate-900">导出为 Markdown</div>
              <div className="text-sm text-slate-500">便于版本控制和分享</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}