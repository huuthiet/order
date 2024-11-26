import { CreateTableDialog } from '@/components/app/dialog'
import { useTables } from '@/hooks'

export default function TablePage() {
  // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  // const [open, setOpen] = useState(false)
  // const [tableName, setTableName] = useState('')
  // const { t } = useTranslation(['table'])
  // const { t: tToast } = useTranslation('toast')
  const { data: tables } = useTables()
  // const createTable = useCreateTable()

  // const onConnect = useCallback(
  //   (params) => setEdges((eds) => addEdge(params, eds)),
  //   [setEdges],
  // )

  // const handleCreateTable = () => {
  //   createTable.mutate(
  //     { name: tableName },
  //     {
  //       onSuccess: () => {
  //         setOpen(false)
  //         setTableName('')
  //         showToast(t('createTableSuccess'))
  //       },
  //     },
  //   )
  // }

  return (
    <div className="flex h-full flex-col gap-4 px-4">
      <div className="flex items-center justify-end">
        <CreateTableDialog />
      </div>
      <div className="flex h-full items-start justify-start gap-2 rounded-md border p-4">
        {tables?.result.map((table) => (
          <div
            key={table.slug}
            className="flex h-[8rem] w-[8rem] items-center justify-center rounded-md border p-4"
          >
            <div>{table.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
