import { useApp } from "@/providers/app-provider";
import ModalComponent from "../modal/modal-component";
import FormComponent from "../form/form-component";
import { deleteData } from "@/lib/db/functions";

export default function DeleteComponent () {
  const { deleteId, setDeleteId } = useApp()

  return (
    <ModalComponent options={{
      header: `Delete${deleteId ? " "+deleteId?.title : ""}`,
      description: `Are you sure you want to delete this${deleteId ? " "+deleteId?.title?.toLowerCase() : ""}?`,
      isOpen: deleteId ? true : false,
      onClose: () => {
        setDeleteId(null)
      }
    }}>
      {((props) => (
        <FormComponent
          fields={[]}
          handleSubmit={() => deleteId ? deleteData({
            data: {
              table: deleteId?.table,
              id: deleteId?.id,
              title: deleteId?.title
            }
          }) : {}}
          onSuccess={() => {
            props.close()
          }}
          onCancel={() => {
            props.close()
          }}
          options={{
            queryKey: deleteId?.table,
            submitText: 'Delete',
            submitVariant: "destructive"
          }}
        />
      ))}
    </ModalComponent>
  )
}