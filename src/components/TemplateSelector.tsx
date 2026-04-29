import { TEMPLATES } from '@/types/resume'
import { X } from 'lucide-react'

interface TemplateSelectorProps {
  onClose: () => void
  onSelect: (templateId: string) => void
}

const layoutLabels: Record<string, string> = {
  'single-column': '单栏',
  'two-column': '双栏',
}

export function TemplateSelector({ onClose, onSelect }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">选择模板</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onSelect(template.id)
                onClose()
              }}
              className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-center"
            >
              <div
                className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${template.colors.primary}20, ${template.colors.accent}20)`,
                }}
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-slate-900 text-sm">{template.name}</div>
                <div className="text-xs text-slate-500">{layoutLabels[template.layout] || template.layout}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}