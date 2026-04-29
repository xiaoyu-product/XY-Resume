import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js'

export interface ParsedResume {
  name?: string
  title?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  education?: {
    school?: string
    degree?: string
    major?: string
    startDate?: string
    endDate?: string
    description?: string
  }[]
  experience?: {
    company?: string
    position?: string
    startDate?: string
    endDate?: string
    description?: string
  }[]
  skills?: string[]
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const result: ParsedResume = {}
  
  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const text = await extractTextFromPDF(file)
    return parseTextToResume(text)
  }
  
  if (file.name.endsWith('.docx')) {
    const text = await extractTextFromDocx(file)
    return parseTextToResume(text)
  }
  
  return result
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item) => (item as { str: string }).str).join(' ')
  }
  
  return text
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

function parseTextToResume(text: string): ParsedResume {
  const result: ParsedResume = {}
  
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi
  const phoneRegex = /(?:\+?86)?1[3-9]\d{9}/g
  
  const emails = text.match(emailRegex)
  if (emails && emails.length > 0) {
    result.email = emails[0]
  }
  
  const phones = text.match(phoneRegex)
  if (phones && phones.length > 0) {
    result.phone = phones[0]
  }
  
  const nameMatch = text.match(/姓\s*名[\s：:]*([\u4e00-\u9fa5]{2,4})/)
  if (nameMatch) {
    result.name = nameMatch[1]
  }
  
  const titleMatch = text.match(/(职位|应聘岗位|求职意向)[\s：:]*([\u4e00-\u9fa5a-zA-Z\s]+)/)
  if (titleMatch) {
    result.title = titleMatch[2].trim()
  }
  
  const locationMatch = text.match(/(所在地|住址|地址)[\s：:]*([\u4e00-\u9fa5]+)/)
  if (locationMatch) {
    result.location = locationMatch[2].trim()
  }
  
  const summaryMatch = text.match(/(个人简介|自我介绍|自我评价)[\s：:]*([\u4e00-\u9fa5a-zA-Z0-9，。、；；！？\s]+?)(?=\n|\r|教育背景|工作经历|项目经验|技能)/)
  if (summaryMatch) {
    result.summary = summaryMatch[2].trim()
  }
  
  const educationSection = text.match(/(教育背景|教育经历|学历)[\s：:]*([\s\S]*?)(?=\n|\r|工作经历|项目经验|技能|$)/)
  if (educationSection) {
    result.education = parseEducationSection(educationSection[2])
  }
  
  const experienceSection = text.match(/(工作经历|工作经验|职业经历)[\s：:]*([\s\S]*?)(?=\n|\r|教育背景|项目经验|技能|$)/)
  if (experienceSection) {
    result.experience = parseExperienceSection(experienceSection[2])
  }
  
  const skillsSection = text.match(/(技能|专业技能|核心技能)[\s：:]*([\s\S]*?)(?=\n|\r|教育背景|工作经历|项目经验|$)/)
  if (skillsSection) {
    result.skills = parseSkillsSection(skillsSection[2])
  }
  
  return result
}

interface EducationItem {
  school?: string
  degree?: string
  major?: string
  startDate?: string
  endDate?: string
  description?: string
}

function parseEducationSection(text: string): ParsedResume['education'] {
  const items: ParsedResume['education'] = []
  const lines = text.split(/\n|\r/).filter(line => line.trim())
  
  let currentItem: EducationItem = {}
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.match(/\d{4}[\-/年]/)) {
      if (currentItem.school) {
        items.push(currentItem)
        currentItem = {}
      }
      const dateMatch = trimmedLine.match(/(\d{4})[\-/年](\d{1,2})?[\-/月]?(\d{1,2})?日?[\s至到\-~](\d{4})[\-/年](\d{1,2})?[\-/月]?(\d{1,2})?日?/)
      if (dateMatch) {
        currentItem.startDate = `${dateMatch[1]}-${dateMatch[2]?.padStart(2, '0') || '01'}`
        currentItem.endDate = `${dateMatch[4]}-${dateMatch[5]?.padStart(2, '0') || '01'}`
      }
    } else if (trimmedLine.match(/(本科|硕士|博士|大专|高中)/)) {
      currentItem.degree = trimmedLine
    } else if (!currentItem.school) {
      currentItem.school = trimmedLine
    } else {
      currentItem.description = (currentItem.description || '') + trimmedLine
    }
  }
  
  if (currentItem.school) {
    items.push(currentItem)
  }
  
  return items
}

interface ExperienceItem {
  company?: string
  position?: string
  startDate?: string
  endDate?: string
  description?: string
}

function parseExperienceSection(text: string): ParsedResume['experience'] {
  const items: ParsedResume['experience'] = []
  const lines = text.split(/\n|\r/).filter(line => line.trim())
  
  let currentItem: ExperienceItem = {}
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.match(/\d{4}[\-/年]/)) {
      if (currentItem.company) {
        items.push(currentItem)
        currentItem = {}
      }
      const dateMatch = trimmedLine.match(/(\d{4})[\-/年](\d{1,2})?[\-/月]?(\d{1,2})?日?[\s至到\-~](\d{4})[\-/年](\d{1,2})?[\-/月]?(\d{1,2})?日?|至今/)
      if (dateMatch) {
        currentItem.startDate = `${dateMatch[1]}-${dateMatch[2]?.padStart(2, '0') || '01'}`
        currentItem.endDate = trimmedLine.includes('至今') ? '' : `${dateMatch[4]}-${dateMatch[5]?.padStart(2, '0') || '01'}`
      }
    } else if (!currentItem.company) {
      currentItem.company = trimmedLine
    } else if (!currentItem.position) {
      currentItem.position = trimmedLine
    } else {
      currentItem.description = (currentItem.description || '') + trimmedLine
    }
  }
  
  if (currentItem.company) {
    items.push(currentItem)
  }
  
  return items
}

function parseSkillsSection(text: string): string[] {
  const skills: string[] = []
  const skillPatterns = [
    /[\u4e00-\u9fa5a-zA-Z+#.]+(?:[,，、]\s*[\u4e00-\u9fa5a-zA-Z+#.]+)*/g,
  ]
  
  for (const pattern of skillPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => {
        const items = match.split(/[,，、]/).map(s => s.trim()).filter(s => s.length > 1)
        skills.push(...items)
      })
    }
  }
  
  return [...new Set(skills)]
}
