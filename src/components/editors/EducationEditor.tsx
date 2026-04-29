import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2 } from 'lucide-react'

export function EducationEditor() {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore()
  const { education } = resume

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">教育经历</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>暂无教育经历，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-slate-900">教育经历 #{education.indexOf(item) + 1}</span>
                <button
                  onClick={() => removeEducation(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">学校</label>
                  <input
                    type="text"
                    value={item.school}
                    onChange={(e) => updateEducation(item.id, { school: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="学校名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">学历</label>
                  <select
                    value={item.degree}
                    onChange={(e) => updateEducation(item.id, { degree: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">请选择</option>
                    <option value="高中">高中</option>
                    <option value="专科">专科</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">专业</label>
                  <input
                    type="text"
                    value={item.major}
                    onChange={(e) => updateEducation(item.id, { major: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="专业名称"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
                    <input
                      type="month"
                      value={item.startDate}
                      onChange={(e) => updateEducation(item.id, { startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
                    <input
                      type="month"
                      value={item.endDate}
                      onChange={(e) => updateEducation(item.id, { endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateEducation(item.id, { description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="描述您的学习经历和成果..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}