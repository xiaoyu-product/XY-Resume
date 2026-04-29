import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2, Tag } from 'lucide-react'
import { useState } from 'react'

export function ProjectEditor() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore()
  const { projects } = resume
  const [newTech, setNewTech] = useState('')

  const handleAddTech = (projectId: string, tech: string) => {
    if (tech.trim()) {
      const project = projects.find((p) => p.id === projectId)
      if (project) {
        const updatedTechs = [...project.technologies, tech.trim()]
        updateProject(projectId, { technologies: updatedTechs })
      }
      setNewTech('')
    }
  }

  const handleRemoveTech = (projectId: string, techToRemove: string) => {
    const project = projects.find((p) => p.id === projectId)
    if (project) {
      const updatedTechs = project.technologies.filter((t) => t !== techToRemove)
      updateProject(projectId, { technologies: updatedTechs })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">项目经验</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p>暂无项目经验，点击上方按钮添加</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-slate-900">项目 #{projects.indexOf(item) + 1}</span>
                <button
                  onClick={() => removeProject(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">项目名称</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateProject(item.id, { name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="项目名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">担任角色</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateProject(item.id, { role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="您在项目中的角色"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
                  <input
                    type="month"
                    value={item.startDate}
                    onChange={(e) => updateProject(item.id, { startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
                  <input
                    type="month"
                    value={item.endDate}
                    onChange={(e) => updateProject(item.id, { endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">项目描述</label>
                <textarea
                  value={item.description}
                  onChange={(e) => updateProject(item.id, { description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="描述项目背景、目标和您的贡献..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">技术栈</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tech}
                      <button
                        onClick={() => handleRemoveTech(item.id, tech)}
                        className="ml-1 hover:text-indigo-900"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech(item.id, newTech))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    placeholder="添加技术标签..."
                  />
                  <button
                    onClick={() => handleAddTech(item.id, newTech)}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm"
                  >
                    添加
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}