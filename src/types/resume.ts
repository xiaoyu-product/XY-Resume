export interface PersonalInfo {
  id: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  avatar?: string
  summary: string
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  description: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
  technologies: string[]
}

export interface Skill {
  id: string
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface ResumeData {
  id: string
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skill[]
}

export type ResumeSection = 'personalInfo' | 'education' | 'experience' | 'projects' | 'skills'

export interface TemplateConfig {
  id: string
  name: string
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fontFamily: string
  layout: 'single-column' | 'two-column'
}

export const DEFAULT_RESUME: ResumeData = {
  id: 'default',
  personalInfo: {
    id: 'personal-1',
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic',
    name: '经典简约',
    preview: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=clean%20classic%20resume%20template%20with%20black%20header%20simple%20elegant%20professional%20layout%20portrait&image_size=portrait_4_3',
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      accent: '#0f3460',
    },
    fontFamily: 'Georgia, serif',
    layout: 'single-column',
  },
  {
    id: 'modern',
    name: '现代极简',
    preview: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20minimalist%20resume%20template%20two%20column%20design%20blue%20accent%20clean%20professional&image_size=portrait_4_3',
    colors: {
      primary: '#2d3436',
      secondary: '#636e72',
      accent: '#0984e3',
    },
    fontFamily: 'Inter, sans-serif',
    layout: 'two-column',
  },
  {
    id: 'creative',
    name: '创意设计',
    preview: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=creative%20colorful%20resume%20template%20purple%20gradient%20artistic%20modern%20unique%20layout&image_size=portrait_4_3',
    colors: {
      primary: '#6c5ce7',
      secondary: '#a29bfe',
      accent: '#fd79a8',
    },
    fontFamily: 'Poppins, sans-serif',
    layout: 'two-column',
  },
  {
    id: 'professional',
    name: '商务专业',
    preview: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=corporate%20business%20resume%20template%20navy%20blue%20formal%20professional%20executive%20style&image_size=portrait_4_3',
    colors: {
      primary: '#2c3e50',
      secondary: '#34495e',
      accent: '#3498db',
    },
    fontFamily: 'Roboto, sans-serif',
    layout: 'single-column',
  },
  {
    id: 'elegant',
    name: '优雅精致',
    preview: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=elegant%20luxury%20resume%20template%20gold%20accents%20black%20white%20sophisticated%20formal&image_size=portrait_4_3',
    colors: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a',
      accent: '#c9a227',
    },
    fontFamily: 'Playfair Display, serif',
    layout: 'single-column',
  },
  {
    id: 'tech',
    name: '科技风格',
    preview: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=tech%20startup%20resume%20template%20dark%20theme%20green%20cyber%20futuristic%20developer%20style&image_size=portrait_4_3',
    colors: {
      primary: '#0d1117',
      secondary: '#161b22',
      accent: '#58a6ff',
    },
    fontFamily: 'JetBrains Mono, monospace',
    layout: 'two-column',
  },
]