import { useApp } from "@/providers/app-provider";
import ModalComponent from "../modal/modal-component";
import FormComponent from "../form/form-component";
import { deleteData } from "@/lib/db/functions";

export default function DeleteComponent () {
  const { deleteModal, setDeleteModal } = useApp()

  return (
    <ModalComponent options={{
      header: `Delete${deleteModal ? " "+deleteModal?.title : ""}`,
      description: `Are you sure you want to delete this${deleteModal ? " "+deleteModal?.title?.toLowerCase() : ""}?`,
      isOpen: deleteModal ? true : false,
      onClose: () => {
        setDeleteModal(null)
      }
    }}>
      {((props) => (
        <FormComponent
          fields={[]}
          handleSubmit={() => deleteModal ? deleteData({
            data: {
              table: deleteModal?.table,
              id: deleteModal?.id,
              title: deleteModal?.title
            }
          }) : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            queryKey: deleteModal?.table,
            submitText: 'Delete',
            submitVariant: "destructive"
          }}
        />
      ))}
    </ModalComponent>
  )
}