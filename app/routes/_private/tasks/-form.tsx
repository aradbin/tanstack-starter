import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { createTask, taskFormFields } from "./-utils"
import { useApp } from "@/providers/app-provider"
import { useQuery } from "@tanstack/react-query"
import { getData, updateData } from "@/lib/db/functions"

export default function TaskForm() {
  const { isTaskOpen, setIsTaskOpen, editId, setEditId } = useApp()
  
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', editId],
    queryFn: () => getData({ data: { table: "tasks", id: editId } }),
    enabled: !!editId && isTaskOpen
  })

  return (
    <ModalComponent options={{
      header: editId ? 'Edit Task' : 'Create Task',
      isOpen: isTaskOpen,
      onClose: () => {
        setIsTaskOpen(false)
        setEditId(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={taskFormFields}
          handleSubmit={(values: Record<string, any>) => editId ?
            updateData({ data: { table: "tasks", id: editId, values, title: "Task" } }) :
            createTask({ data: { values } })}
          values={isTaskOpen && editId && task ? task : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            isLoading,
            queryKey: 'tasks'
          }}
        />
      )}
    </ModalComponent>
  )
}