import { useResumeStore } from '@/store/resumeStore'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ResumePreview() {
  const { resume, currentTemplate } = useResumeStore()
  const { personalInfo, education, experience, projects, skills } = resume

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return '入门'
      case 'intermediate':
        return '熟练'
      case 'advanced':
        return '精通'
      case 'expert':
        return '专家'
      default:
        return level
    }
  }

  return (
    <div className="flex justify-center">
      <div
        className="w-[800px] bg-white shadow-lg"
        style={{ fontFamily: currentTemplate.fontFamily }}
      >
        <div className="p-8">
          <header className="text-center mb-8 pb-6 border-b" style={{ borderColor: currentTemplate.colors.secondary + '40' }}>
            <h1 className="text-3xl font-bold mb-2" style={{ color: currentTemplate.colors.primary }}>
              {personalInfo.name || '您的姓名'}
            </h1>
            <p className="text-lg mb-4" style={{ color: currentTemplate.colors.accent }}>
              {personalInfo.title || '您的职位'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {personalInfo.location}
                </span>
              )}
            </div>
          </header>

          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: currentTemplate.colors.primary }}>
                个人简介
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: currentTemplate.colors.primary }}>
                工作经历
              </h2>
              <div className="space-y-4">
                {experience.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-900">{item.company}</span>
                      <span className="text-sm text-slate-500">
                        {item.startDate} - {item.endDate || '至今'}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: currentTemplate.colors.accent }}>
                      {item.position}
                    </p>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: currentTemplate.colors.primary }}>
                教育背景
              </h2>
              <div className="space-y-4">
                {education.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-900">{item.school}</span>
                      <span className="text-sm text-slate-500">
                        {item.startDate} - {item.endDate}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: currentTemplate.colors.accent }}>
                      {item.degree} · {item.major}
                    </p>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3" style={{ color: currentTemplate.colors.primary }}>
                项目经验
              </h2>
              <div className="space-y-4">
                {projects.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-900">{item.name}</span>
                      <span className="text-sm text-slate-500">
                        {item.startDate} - {item.endDate || '至今'}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: currentTemplate.colors.accent }}>
                      角色：{item.role}
                    </p>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{
                              backgroundColor: currentTemplate.colors.accent + '20',
                              color: currentTemplate.colors.accent,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3" style={{ color: currentTemplate.colors.primary }}>
                专业技能
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm text-slate-700">{item.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: currentTemplate.colors.accent + '15',
                        color: currentTemplate.colors.accent,
                      }}
                    >
                      {getLevelLabel(item.level)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}