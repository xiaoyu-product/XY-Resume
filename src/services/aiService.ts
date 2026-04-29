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

const env = import.meta as unknown as { env: Record<string, string | undefined> }
const API_BASE_URL = env.env.VITE_AI_API_URL || 'https://api.openai.com/v1'
const API_KEY = env.env.VITE_AI_API_KEY || ''

export async function polishText(text: string, type: 'summary' | 'description' = 'summary'): Promise<AIResponse> {
  if (!text.trim()) {
    return { success: false, error: '请输入需要润色的文本' }
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
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
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

    const prompt = `
      请帮我润色以下简历内容，使其更加专业、有竞争力：
      
      ${allTexts.join('\n\n')}
      
      要求：
      1. 优化个人简介，突出核心竞争力
      2. 工作经历和项目经验使用动词开头，量化成果
      3. 使用专业术语但保持简洁易懂
      4. 返回格式保持原样，只需优化文字内容
    `

    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
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
