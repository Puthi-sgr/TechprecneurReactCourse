import { useState } from 'react'
import { InfoList } from './components/InfoList'
import { ProjectCard } from './components/ProjectCard'
import { Section } from './components/Section'
import { Button } from '@/components/ui/button'

const projects = [
  {
    title: 'Developer Portfolio',
    description:
      'This responsive profile page, rebuilt from reusable components with Tailwind and shadcn/ui.',
    status: 'Live',
    statusVariant: 'default',
    href: '#portfolio',
  },
  {
    title: 'Task Tracker',
    description:
      'A small React app for planning weekly learning goals and tracking progress across sessions.',
    status: 'In progress',
    statusVariant: 'secondary',
    href: '#task-tracker',
  },
]

const skills = [
  { label: 'React', detail: 'Components & JSX' },
  { label: 'Props & state', detail: 'useState, one-way data flow' },
  { label: 'Tailwind CSS', detail: 'Utility-first styling' },
  { label: 'shadcn/ui', detail: 'Composable UI blocks' },
]

const contact = [
  { label: 'Email', detail: 'hello@chetha.dev', href: 'mailto:hello@chetha.dev' },
  { label: 'GitHub', detail: '@chethaputhi', href: 'https://github.com' },
  { label: 'LinkedIn', detail: 'in/chethaputhi', href: 'https://linkedin.com' },
]

function App() {
  const [isOpenToWork, setIsOpenToWork] = useState(true)
  const name = 'Chetha Puthi'
  const goal =
    'Master React fundamentals, component architecture, and JSX to build solid web applications.'

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <header className="border-b border-gray-200 pb-8">
          <p className="mb-2 text-sm font-medium text-gray-500">Learning log</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{name}</h1>
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
              <span
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                  isOpenToWork ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              />
              {isOpenToWork ? 'Open to work' : 'Busy learning'}
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">{goal}</p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setIsOpenToWork(!isOpenToWork)}
          >
            Toggle status
          </Button>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <main className="md:col-span-2">
            <Section title="Projects">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            </Section>
          </main>

          <aside className="space-y-6">
            <Section title="Skills">
              <InfoList items={skills} />
            </Section>
            <Section title="Contact">
              <InfoList items={contact} />
            </Section>
          </aside>
        </div>

        <footer className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            © 2026 {name}. Built with React, Tailwind CSS, and shadcn/ui.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
