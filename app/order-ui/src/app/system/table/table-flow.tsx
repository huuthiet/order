import { useCallback, useState, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  Node,
} from '@xyflow/react'
import { Button } from '@/components/ui/button'
import { ImageIcon } from '@radix-ui/react-icons'
import { ITable } from '@/types'
import TableNode from './table-node'
import TableContextMenu from './table-context-menu'
import '@xyflow/react/dist/style.css'

const nodeTypes = {
  table: TableNode,
}

// Kích thước cố định cho map
// const MAP_WIDTH = 1000
// const MAP_HEIGHT = 600

interface TableFlowProps {
  tables: ITable[]
}

export default function TableFlow({ tables }: TableFlowProps) {
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    tableId: string
  } | null>(null)

  const getNodesFromTables = (tables: ITable[]): Node[] => {
    return tables.map((table) => ({
      id: table.slug,
      type: 'table',
      position: {
        x: table.xPosition ?? Math.random(), // Trừ đi kích thước của table
        y: table.yPosition ?? Math.random(), // Trừ đi kích thước của table
      },
      data: {
        name: table.name,
        status: table.isEmpty || 'available',
        onContextMenu: (event: React.MouseEvent, tableId: string) => {
          event.preventDefault()
          setContextMenu({
            x: event.clientX,
            y: event.clientY,
            tableId: tableId,
          })
        },
      },
      dragHandle: '.drag-handle',
    }))
  }

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges] = useEdgesState([])

  useEffect(() => {
    if (tables && tables.length > 0) {
      const newNodes = getNodesFromTables(tables)
      setNodes(newNodes)
    }
  }, [tables, setNodes])

  // Xử lý giới hạn kéo thả
  //   const onNodeDrag = useCallback(
  //     (node: Node) => {
  //       const TABLE_SIZE = 80 // Kích thước của table (80px)

  //       setNodes((nds) =>
  //         nds.map((n) => {
  //           if (n.id === node.id) {
  //             const x = Math.max(0, Math.min(TABLE_SIZE, node.position.x))
  //             const y = Math.max(0, Math.min(TABLE_SIZE, node.position.y))

  //             return {
  //               ...n,
  //               position: { x, y },
  //             }
  //           }
  //           return n
  //         }),
  //       )
  //     },
  //     [setNodes],
  //   )

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBackgroundImage(imageUrl)
    }
  }

  const handleStatusChange = useCallback(
    (tableId: string, status: 'available' | 'occupied' | 'reserved') => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === tableId
            ? { ...node, data: { ...node.data, status } }
            : node,
        ),
      )
      setContextMenu(null)
    },
    [setNodes],
  )

  const handleDeleteTable = useCallback(
    (tableId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== tableId))
      setContextMenu(null)
    },
    [setNodes],
  )

  return (
    <div className="relative h-full w-full rounded-lg border">
      <div
        className="relative h-full w-full"
        style={{
          overflow: 'hidden', // Ngăn scroll và mở rộng
        }}
      >
        {/* Background Image Upload Button */}
        <div className="absolute right-4 top-4 z-10">
          <label htmlFor="bg-image-upload">
            <Button variant="outline" className="gap-2" asChild>
              <div>
                <ImageIcon className="h-4 w-4" />
                Upload Background
              </div>
            </Button>
          </label>
          <input
            id="bg-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Background Image */}
        {backgroundImage && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4,
            }}
          />
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          minZoom={1}
          maxZoom={1}
          zoomOnScroll={false}
          zoomOnPinch={false}
          panOnScroll={false}
          panOnDrag={false}
          preventScrolling={true}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
          }}
        >
          <Background gap={12} size={1} />
        </ReactFlow>

        {/* Context Menu */}
        {contextMenu && (
          <TableContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            tableId={contextMenu.tableId}
            onClose={() => setContextMenu(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTable}
          />
        )}
      </div>
    </div>
  )
}
