import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { createTask, taskPriorityOptions, taskStatusOptions } from "./-utils"
import { useApp } from "@/providers/app-provider"
import { useQuery } from "@tanstack/react-query"
import { getData, updateData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { formatDateForInput } from "@/lib/utils"

export default function TaskForm() {
  const { isTaskOpen, setIsTaskOpen, editId, setEditId, users } = useApp()
  
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', editId],
    queryFn: async () => {
      const result = await getData({ data: {
        table: "tasks",
        relation: {
          taskUsers: {
            with: {
              user: true
            }
          }
        },
        id: editId
      }})
      
      if(result){
        return {
          ...result,
          assignee: result.taskUsers?.find((taskUser: AnyType) => taskUser?.role === 'assignee')?.user?.id
        }
      }

      return result
    },
    enabled: !!editId && isTaskOpen
  })

  const taskFormFields: FormFieldType[][] = [
    [
      {
        name: "title",
        validationOnSubmit: stringRequiredValidation("Title"),
        placeholder: "Enter title",
      },
    ],
    [
      {
        name: "description",
        type: "textarea",
        validationOnSubmit: stringValidation("Description"),
        placeholder: "Enter description",
      }
    ],
    [
      {
        name: "status",
        type: "select",
        options: taskStatusOptions,
        validationOnSubmit: stringRequiredValidation("Status"),
        defaultValue: "todo",
      },
      {
        name: "priority",
        type: "select",
        options: taskPriorityOptions,
        validationOnSubmit: stringRequiredValidation("Priority"),
        defaultValue: "medium",
      }
    ],
    [
      {
        name: "dueDate",
        label: "Due Date",
        type: "date",
        validationOnSubmit: stringRequiredValidation("Due Date"),
        placeholder: "Select Due Date",
        defaultValue: formatDateForInput(new Date()),
      }
    ],
    [
      {
        name: 'assignee',
        type: 'user',
        options: users,
        validationOnSubmit: stringRequiredValidation('Assignee'),
      }
    ],
  ]

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