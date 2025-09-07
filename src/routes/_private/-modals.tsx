import TaskForm from '@/routes/_private/tasks/-form'
import DeleteComponent from '@/components/app/delete-component'
import ContactForm from './contacts/-form'
import CustomerForm from './customers/-form'

export default function Modals() {
  return (
    <>
      <TaskForm />
      <ContactForm />
      <CustomerForm />
      <DeleteComponent />
    </>
  )
}
