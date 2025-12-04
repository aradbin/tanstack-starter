import FormComponent from "@/components/form/form-component"
import ModalComponent from "@/components/modal/modal-component"
import { createTask, taskPriorityOptions, taskStatusOptions, updateTask } from "./-utils"
import { useApp } from "@/providers/app-provider"
import { useQuery } from "@tanstack/react-query"
import { getData } from "@/lib/db/functions"
import { AnyType, FormFieldType } from "@/lib/types"
import { stringRequiredValidation, stringValidation } from "@/lib/validations"
import { formatDateForInput } from "@/lib/utils"

export default function TaskForm() {
  const { taskModal, setTaskModal, users } = useApp()
  
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', taskModal?.id],
    queryFn: async () => {
      const result = await getData({ data: {
        table: "tasks",
        relation: {
          taskEntities: true
        },
        id: taskModal?.id
      }})
      
      if(result){
        return {
          ...result,
          assignee: result?.taskEntities?.find((taskEntity: AnyType) => taskEntity?.role === 'assignee')?.user?.id,
          reporter: result?.taskEntities?.find((taskEntity: AnyType) => taskEntity?.role === 'reporter')?.user?.id,
          owner: result?.taskEntities?.find((taskEntity: AnyType) => taskEntity?.role === 'owner')?.user?.id
        }
      }

      return result
    },
    enabled: !!taskModal?.id && taskModal?.isOpen
  })

  const formFields: FormFieldType[][] = [
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
        validationOnSubmit: stringValidation('Assignee'),
      }
    ],
    [
      {
        name: 'reporter',
        type: 'user',
        options: users,
        validationOnSubmit: stringValidation('Reporter'),
      }
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: taskModal?.id ? 'Edit Task' : 'Create Task',
      isOpen: taskModal?.isOpen,
      onClose: () => {
        setTaskModal(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => taskModal?.id ?
            updateTask({ data: { id: taskModal?.id, values, } }) :
            createTask({ data: { values } })}
          values={taskModal?.isOpen && taskModal?.id && data ? data : {}}
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