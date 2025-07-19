import { useApp } from '@/providers/app-provider'
import TaskForm from '@/routes/_private/tasks/-form'
import DeleteComponent from '@/components/app/delete-component'

export default function Modals() {
  const { isTaskOpen, deleteId } = useApp()

  return (
    <>
      {isTaskOpen && <TaskForm />}
      {deleteId && <DeleteComponent />}
    </>
  )
}
