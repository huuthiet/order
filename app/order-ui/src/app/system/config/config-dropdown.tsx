import React from "react";
import {
    MoreHorizontal,
    PenSquare,
    Trash,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button
} from "@/components/ui"
import { DeleteSystemConfigDialog, UpdateSystemConfigDialog } from "@/components/app/dialog"
import { ISystemConfig } from "@/types"

export default function ConfigDropdown({ systemConfig }: { systemConfig: ISystemConfig }) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault(); // Ngăn dropdown bị đóng
                            setIsDialogOpen(true); // Mở dialog
                        }}
                    >
                        <PenSquare className="mr-2 icon" />
                        <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault(); // Ngăn dropdown bị đóng
                            setIsDeleteDialogOpen(true); // Mở dialog
                        }}>
                        <Trash className="mr-2 icon" />
                        <span>Xóa</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
            {isDialogOpen && (
                <UpdateSystemConfigDialog
                    systemConfig={systemConfig}
                    onClose={() => setIsDialogOpen(false)} // Đóng dialog khi cần
                />
            )}
            {isDeleteDialogOpen && (
                <DeleteSystemConfigDialog
                    systemConfig={systemConfig}
                    onClose={() => setIsDeleteDialogOpen(false)} // Đóng dialog khi cần
                />
            )}
        </DropdownMenu>
    );
}
