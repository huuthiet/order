import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui'
import { useTables } from '@/hooks'
import { useUserStore } from '@/stores'
import { ITable } from '@/types' // Make sure to import your Table type

interface SelectTablePageProps {
    onTableSelect?: (table: ITable) => void
    selectedTableId?: string
}

export default function SelectTablePage({ onTableSelect, selectedTableId }: SelectTablePageProps) {
    const { t } = useTranslation(['table'])
    const { getUserInfo } = useUserStore()
    const { data: tables } = useTables(getUserInfo()?.branch.slug)
    const [backgroundImage, setBackgroundImage] = useState<string>('')
    const mapRef = useRef<HTMLDivElement>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setBackgroundImage(imageUrl)
        }
    }

    const TableItem = ({ table }: { table: ITable }) => {
        const isSelected = selectedTableId === table.slug

        return (
            <div
                className={`absolute h-20 w-20 cursor-pointer transition-all duration-200 ${isSelected
                        ? 'ring-4 ring-primary scale-105 shadow-lg z-10'
                        : 'hover:ring-2 hover:ring-primary/50'
                    }`}
                style={{
                    left: table.xPosition,
                    top: table.yPosition,
                }}
                onClick={() => onTableSelect?.(table)}
            >
                <div className={`flex items-center justify-center w-full h-full p-2 text-center border rounded-md ${isSelected ? 'bg-primary/10 border-primary' : 'bg-background'
                    }`}>
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                        {table.name}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen gap-4 px-4">
            <div className="flex items-center justify-end gap-2 py-4">
                <div>
                    <label htmlFor="bg-image-upload">
                        <Button variant="outline" className="gap-2" asChild>
                            <div>
                                <ImageIcon className="w-4 h-4" />
                                {t('table.uploadBackgroundImage')}
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
            </div>

            <div className="relative flex-1 border rounded-md">
                <div
                    ref={mapRef}
                    className="relative w-full h-full"
                    style={{
                        backgroundImage: backgroundImage
                            ? `url(${backgroundImage})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {tables?.result.map((table) => (
                        <TableItem key={table.slug} table={table} />
                    ))}
                </div>
            </div>
        </div>
    )
}