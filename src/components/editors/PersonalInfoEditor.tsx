import { useResumeStore } from '@/store/resumeStore'
import { Camera, X } from 'lucide-react'

export function PersonalInfoEditor() {
  const { resume, updatePersonalInfo } = useResumeStore()
  const { personalInfo } = resume

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updatePersonalInfo({ avatar: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    updatePersonalInfo({ avatar: undefined })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">个人信息</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
            {personalInfo.avatar ? (
              <img
                src={personalInfo.avatar}
                alt="头像"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
          {personalInfo.avatar && (
            <button
              onClick={removeAvatar}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
        <div className="text-sm text-slate-500">
          <p>点击相机图标上传头像</p>
          <p className="text-xs mt-1">支持 JPG、PNG 格式</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.name}
            onChange={(e) => updatePersonalInfo({ name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="请输入姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            职位 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={personalInfo.title}
            onChange={(e) => updatePersonalInfo({ title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="如：前端工程师"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">电话</label>
          <input
            type="tel"
            value={personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            placeholder="请输入手机号"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">所在地</label>
        <input
          type="text"
          value={personalInfo.location}
          onChange={(e) => updatePersonalInfo({ location: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          placeholder="如：北京市朝阳区"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">个人简介</label>
        <textarea
          value={personalInfo.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="简述您的专业背景和核心优势..."
        />
      </div>
    </div>
  )
}