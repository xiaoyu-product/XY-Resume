import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2 } from 'lucide-react'

export function ExperienceEditor() {
  const { resume, addExperience, updateExperience, removeExperience } = useResumeStore()
  const { experience } = resume

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">工作经历</h2>
        <button
          onClick={addExperience}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>暂无工作经历，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-slate-900">工作经历 #{experience.indexOf(item) + 1}</span>
                <button
                  onClick={() => removeExperience(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">公司</label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => updateExperience(item.id, { company: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="公司名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">职位</label>
                  <input
                    type="text"
                    value={item.position}
                    onChange={(e) => updateExperience(item.id, { position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="职位名称"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateExperience(item.id, { startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
                  <input
                    type="month"
                    value={item.endDate}
                    onChange={(e) => updateExperience(item.id, { endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">工作描述</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateExperience(item.id, { description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="描述您的工作职责和成就..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}