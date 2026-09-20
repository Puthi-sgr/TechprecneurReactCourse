import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ProjectCard({ title, description, status, statusVariant, href }) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between gap-4">
          <CardTitle className="text-gray-900">{title}</CardTitle>
          <Badge variant={statusVariant}>{status}</Badge>
        </div>
        <CardDescription className="text-gray-500">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button render={<a href={href} />}>View project</Button>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard
