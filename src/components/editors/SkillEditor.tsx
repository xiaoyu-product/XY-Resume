import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2 } from 'lucide-react'

export function SkillEditor() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore()
  const { skills } = resume

  const levelOptions = [
    { value: 'beginner', label: '入门' },
    { value: 'intermediate', label: '熟练' },
    { value: 'advanced', label: '精通' },
    { value: 'expert', label: '专家' },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-gray-100 text-gray-600'
      case 'intermediate':
        return 'bg-blue-100 text-blue-600'
      case 'advanced':
        return 'bg-green-100 text-green-600'
      case 'expert':
        return 'bg-indigo-100 text-indigo-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">技能特长</h2>
        <button
          onClick={addSkill}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>暂无技能，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {skills.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateSkill(item.id, { name: e.target.value })}
                className="flex-1 px-2 py-1.5 text-sm border-none bg-transparent focus:ring-0 outline-none"
                placeholder="技能名称"
              />
              <select
                value={item.level}
                onChange={(e) => updateSkill(item.id, { level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | 'expert' })}
                className={`px-2 py-1.5 text-xs rounded-full border-none ${getLevelColor(item.level)} cursor-pointer`}
              >
                {levelOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeSkill(item.id)}
                className="p-1 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}