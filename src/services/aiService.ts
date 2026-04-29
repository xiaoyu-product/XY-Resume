export interface AIPolishResult {
  original: string
  polished: string
  suggestions: string[]
}

export interface AIResponse {
  success: boolean
  data?: AIPolishResult
  error?: string
}

let apiBaseUrl: string
let apiKey: string
let isDemoMode: boolean

try {
  const env = import.meta as unknown as { env: Record<string, string | undefined> }
  apiBaseUrl = env.env.VITE_AI_API_URL || 'https://api.openai.com/v1'
  apiKey = env.env.VITE_AI_API_KEY || ''
  isDemoMode = !apiKey || apiKey.trim() === ''
} catch {
  apiBaseUrl = 'https://api.openai.com/v1'
  apiKey = ''
  isDemoMode = true
}

export const isDemo = isDemoMode

const demoPolishResults: Record<string, { polished: string; suggestions: string[] }> = {
  summary: {
    polished: '具有5年以上全栈开发经验，精通 React、Vue、Node.js 等主流技术栈。善于分析复杂业务需求，能够独立设计和实现高性能的Web应用。具备良好的团队协作能力和项目管理经验，曾主导多个大型项目从0到1的开发工作。',
    suggestions: [
      '突出了技术栈和经验年限',
      '强调了独立工作能力',
      '加入了项目管理经验',
    ],
  },
  description: {
    polished: '负责公司核心产品的架构设计与开发，主导完成了微服务架构改造，系统性能提升40%。带领5人开发团队，按时交付率达到98%。优化数据库查询，将响应时间从2秒缩短至200毫秒。',
    suggestions: [
      '使用动词开头突出成果',
      '量化业绩数据（40%、98%、2秒→200毫秒）',
      '明确团队管理经验',
    ],
  },
}

function getDemoResult(text: string, type: string): AIPolishResult {
  const result = demoPolishResults[type] || demoPolishResults.summary
  return {
    original: text,
    polished: result.polished,
    suggestions: result.suggestions,
  }
}

export async function polishText(text: string, type: 'summary' | 'description' = 'summary'): Promise<AIResponse> {
  if (!text.trim()) {
    return { success: false, error: '请输入需要润色的文本' }
  }

  if (isDemoMode) {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      success: true,
      data: getDemoResult(text, type),
    }
  }

  const prompts: Record<string, string> = {
    summary: `
      请帮我润色这段个人简介，使其更加专业、简洁、有吸引力：
      ${text}
      
      要求：
      1. 突出核心竞争力和专业优势
      2. 使用专业术语但保持简洁易懂
      3. 长度控制在150-200字左右
      4. 输出格式：
      润色结果：[润色后的文本]
      优化建议：[分点列出优化建议]
    `,
    description: `
      请帮我润色这段工作/项目描述，使其更加专业、量化、有说服力：
      ${text}
      
      要求：
      1. 使用动词开头，突出成果和贡献
      2. 尽可能量化业绩（如提升效率X%，节省成本Y元）
      3. 使用专业术语但保持简洁易懂
      4. 输出格式：
      润色结果：[润色后的文本]
      优化建议：[分点列出优化建议]
    `,
  }

  try {
    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的简历优化顾问，擅长帮助求职者优化简历内容，使其更具竞争力。',
          },
          {
            role: 'user',
            content: prompts[type],
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      return { success: false, error: `API 请求失败: ${response.status}` }
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    const resultMatch = content.match(/润色结果：([\s\S]*?)(?=\n优化建议：)/)
    const suggestionsMatch = content.match(/优化建议：([\s\S]*)/)

    return {
      success: true,
      data: {
        original: text,
        polished: resultMatch ? resultMatch[1].trim() : content,
        suggestions: suggestionsMatch 
          ? suggestionsMatch[1].split('\n').filter((s: string) => s.trim()).map((s: string) => s.trim())
          : [],
      },
    }
  } catch (error) {
    console.error('AI polish error:', error)
    return { success: false, error: '网络错误，请稍后重试' }
  }
}

export async function polishResumeSections(): Promise<AIResponse> {
  try {
    const resumeData = localStorage.getItem('magic-resume-data')
    if (!resumeData) {
      return { success: false, error: '没有找到简历数据' }
    }

    const resume = JSON.parse(resumeData)
    const allTexts = []

    if (resume.personalInfo?.summary) {
      allTexts.push(`个人简介: ${resume.personalInfo.summary}`)
    }

    resume.experience?.forEach((exp: { position: string; description: string }) => {
      if (exp.description) {
        allTexts.push(`工作经历[${exp.position}]: ${exp.description}`)
      }
    })

    resume.projects?.forEach((proj: { name: string; description: string }) => {
      if (proj.description) {
        allTexts.push(`项目经验[${proj.name}]: ${proj.description}`)
      }
    })

    if (allTexts.length === 0) {
      return { success: false, error: '简历中没有可润色的内容' }
    }

    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return {
        success: true,
        data: {
          original: allTexts.join('\n\n'),
          polished: '**个人简介优化**：\n具有丰富的专业经验和扎实的技术能力，善于解决复杂问题，具备优秀的团队协作精神。\n\n**工作经历优化**：\n主导多个重要项目的开发与交付，带领团队高效完成任务，显著提升了产品性能和用户体验。\n\n**项目经验优化**：\n负责核心功能模块的设计与实现，运用创新技术方案解决业务痛点，获得用户高度认可。',
          suggestions: ['优化了语言表达，使其更加专业', '突出了核心能力和成就', '使用了更具说服力的表述方式'],
        },
      }
    }

    const prompt = `
      请帮我润色以下简历内容，使其更加专业、有竞争力：
      
      ${allTexts.join('\n\n')}
      
      要求：
      1. 优化个人简介，突出核心竞争力
      2. 工作经历和项目经验使用动词开头，量化成果
      3. 使用专业术语但保持简洁易懂
      4. 返回格式保持原样，只需优化文字内容
    `

    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的简历优化顾问，擅长帮助求职者优化简历内容，使其更具竞争力。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      return { success: false, error: `API 请求失败: ${response.status}` }
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return {
      success: true,
      data: {
        original: allTexts.join('\n\n'),
        polished: content,
        suggestions: [],
      },
    }
  } catch (error) {
    console.error('AI polish error:', error)
    return { success: false, error: '网络错误，请稍后重试' }
  }
}