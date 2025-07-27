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
  const { isTaskOpen, setIsTaskOpen, editId, setEditId, users } = useApp()

  console.count('TaskForm')
  
  const { data, isLoading } = useQuery({
    queryKey: ['tasks', editId],
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
          assignee: result.taskUsers?.find((taskUser: AnyType) => taskUser?.role === 'assignee')?.user?.id,
          owner: result.taskUsers?.find((taskUser: AnyType) => taskUser?.role === 'owner')?.user?.id
        }
      }

      return result
    },
    enabled: !!editId && isTaskOpen
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
        name: 'owner',
        type: 'user',
        options: users,
        validationOnSubmit: stringValidation('Owner'),
      }
    ],
  ]

  return (
    <ModalComponent variant="sheet" options={{
      header: editId ? 'Edit Task' : 'Create Task',
      isOpen: isTaskOpen,
      onClose: () => {
        setIsTaskOpen(false)
        setEditId(null)
      }
    }}>
      {(props) => (
        <FormComponent
          fields={formFields}
          handleSubmit={(values: Record<string, any>) => editId ?
            updateTask({ data: { id: editId, values, } }) :
            createTask({ data: { values } })}
          values={isTaskOpen && editId && data ? data : {}}
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