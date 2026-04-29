import { useNavigate } from '@tanstack/react-router'
import { FileText, Sparkles, ArrowRight, Star } from 'lucide-react'

export function HomePage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Sparkles,
      title: 'AI 智能润色',
      description: '基于国内免费模型，一键优化简历内容',
    },
    {
      icon: FileText,
      title: '实时预览',
      description: '所见即所得的编辑体验',
    },
    {
      icon: Star,
      title: '精美模板',
      description: '多种专业模板可选',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">XY Resume</span>
          </div>
          <button
            onClick={() => navigate({ to: '/workbench' })}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            开始制作
          </button>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <section className="max-w-6xl mx-auto px-4 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI 驱动的智能简历工具
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            打造专业简历
            <br />
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              只需几分钟
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            实时预览、AI 润色、多种模板选择，让您的简历脱颖而出。
            支持 PDF 和 Markdown 导出。
          </p>
          <button
            onClick={() => navigate({ to: '/workbench' })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:shadow-lg"
          >
            免费创建简历
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                简单四步完成简历
              </h2>
              <p className="text-slate-600">快速创建专业简历</p>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: '1', title: '选择模板', desc: '多款精美模板' },
                { step: '2', title: '填写信息', desc: '模块化编辑' },
                { step: '3', title: 'AI 润色', desc: '智能优化内容' },
                { step: '4', title: '导出下载', desc: 'PDF/Markdown' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          Magic Resume - AI 驱动的智能简历工具
        </div>
      </footer>
    </div>
  )
}