import Draggable from 'react-draggable'
import { useState, useRef } from 'react'

export default function Piece() {
  const [currentRotate, setCurrentRotate] = useState(0)

  const isDraggingRef = useRef(false)

  const onDrag = () => {
    isDraggingRef.current = true
  }

  const onStop = () => {
    if (!isDraggingRef.current) {
      setCurrentRotate(currentRotate + 90)
    }
    isDraggingRef.current = false
  }

  return (
    <Draggable onStop={onStop} onDrag={onDrag}>
      <div className="p-4 rounded-sm bg-muted h-fit w-fit">
        <span className="Piece-phrase">Table</span>
      </div>
    </Draggable>
  )
}
