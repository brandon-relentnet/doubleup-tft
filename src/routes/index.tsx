import TypewriterChangeContentExample from '@/components/Typewriter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="">
      <div className="min-h-[calc(100vh-5rem)] flex justify-center items-center">
        <TypewriterChangeContentExample />
      </div>
    </div>
  )
}
