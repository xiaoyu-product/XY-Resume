import { create } from 'zustand'
import { ResumeData, DEFAULT_RESUME, TemplateConfig, TEMPLATES } from '@/types/resume'

interface ResumeStore {
  resume: ResumeData
  currentTemplate: TemplateConfig
  templates: TemplateConfig[]
  activeSection: string
  setResume: (resume: ResumeData) => void
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void
  addEducation: () => void
  updateEducation: (id: string, data: Partial<ResumeData['education'][0]>) => void
  removeEducation: (id: string) => void
  reorderEducation: (fromIndex: number, toIndex: number) => void
  addExperience: () => void
  updateExperience: (id: string, data: Partial<ResumeData['experience'][0]>) => void
  removeExperience: (id: string) => void
  reorderExperience: (fromIndex: number, toIndex: number) => void
  addProject: () => void
  updateProject: (id: string, data: Partial<ResumeData['projects'][0]>) => void
  removeProject: (id: string) => void
  reorderProjects: (fromIndex: number, toIndex: number) => void
  addSkill: () => void
  updateSkill: (id: string, data: Partial<ResumeData['skills'][0]>) => void
  removeSkill: (id: string) => void
  setTemplate: (templateId: string) => void
  setActiveSection: (section: string) => void
  loadResume: (id: string) => void
  saveResume: () => void
  resetResume: () => void
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const STORAGE_KEY = 'magic-resume-data'

const loadFromStorage = (): ResumeData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    console.warn('Failed to load resume from storage')
  }
  return { ...DEFAULT_RESUME, id: generateId() }
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  resume: loadFromStorage(),
  currentTemplate: TEMPLATES[0],
  templates: TEMPLATES,
  activeSection: 'personalInfo',

  setResume: (resume) => {
    set({ resume })
    get().saveResume()
  },

  updatePersonalInfo: (info) => {
    set((state) => ({
      resume: {
        ...state.resume,
        personalInfo: { ...state.resume.personalInfo, ...info },
      },
    }))
    get().saveResume()
  },

  addEducation: () => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: [
          ...state.resume.education,
          {
            id: generateId(),
            school: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            description: '',
          },
        ],
      },
    }))
    get().saveResume()
  },

  updateEducation: (id, data) => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    }))
    get().saveResume()
  },

  removeEducation: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.filter((item) => item.id !== id),
      },
    }))
    get().saveResume()
  },

  reorderEducation: (fromIndex, toIndex) => {
    set((state) => {
      const newEducation = [...state.resume.education]
      const [removed] = newEducation.splice(fromIndex, 1)
      newEducation.splice(toIndex, 0, removed)
      return {
        resume: { ...state.resume, education: newEducation },
      }
    })
    get().saveResume()
  },

  addExperience: () => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: [
          ...state.resume.experience,
          {
            id: generateId(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
          },
        ],
      },
    }))
    get().saveResume()
  },

  updateExperience: (id, data) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    }))
    get().saveResume()
  },

  removeExperience: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.filter((item) => item.id !== id),
      },
    }))
    get().saveResume()
  },

  reorderExperience: (fromIndex, toIndex) => {
    set((state) => {
      const newExperience = [...state.resume.experience]
      const [removed] = newExperience.splice(fromIndex, 1)
      newExperience.splice(toIndex, 0, removed)
      return {
        resume: { ...state.resume, experience: newExperience },
      }
    })
    get().saveResume()
  },

  addProject: () => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: [
          ...state.resume.projects,
          {
            id: generateId(),
            name: '',
            role: '',
            startDate: '',
            endDate: '',
            description: '',
            technologies: [],
          },
        ],
      },
    }))
    get().saveResume()
  },

  updateProject: (id, data) => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    }))
    get().saveResume()
  },

  removeProject: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        projects: state.resume.projects.filter((item) => item.id !== id),
      },
    }))
    get().saveResume()
  },

  reorderProjects: (fromIndex, toIndex) => {
    set((state) => {
      const newProjects = [...state.resume.projects]
      const [removed] = newProjects.splice(fromIndex, 1)
      newProjects.splice(toIndex, 0, removed)
      return {
        resume: { ...state.resume, projects: newProjects },
      }
    })
    get().saveResume()
  },

  addSkill: () => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: [
          ...state.resume.skills,
          { id: generateId(), name: '', level: 'intermediate' },
        ],
      },
    }))
    get().saveResume()
  },

  updateSkill: (id, data) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      },
    }))
    get().saveResume()
  },

  removeSkill: (id) => {
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.filter((item) => item.id !== id),
      },
    }))
    get().saveResume()
  },

  setTemplate: (templateId) => {
    const template = TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      set({ currentTemplate: template })
    }
  },

  setActiveSection: (section) => {
    set({ activeSection: section })
  },

  loadResume: (id) => {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${id}`)
    if (stored) {
      try {
        set({ resume: JSON.parse(stored) })
      } catch {
        console.warn('Failed to load resume')
      }
    }
  },

  saveResume: () => {
    try {
      const { resume } = get()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume))
      localStorage.setItem(`${STORAGE_KEY}-${resume.id}`, JSON.stringify(resume))
    } catch {
      console.warn('Failed to save resume')
    }
  },

  resetResume: () => {
    set({ resume: { ...DEFAULT_RESUME, id: generateId() } })
    get().saveResume()
  },
}))