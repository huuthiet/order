import { useTranslation } from 'react-i18next'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    ScrollArea,
} from '@/components/ui'

import { UpdateSystemConfigForm } from '@/components/app/form'
import { ISystemConfig } from '@/types'

interface IUpdateSystemConfigDialogProps {
    systemConfig?: ISystemConfig;
    onClose: () => void; // Thêm hàm callback đóng dialog
}

export default function UpdateSystemConfigDialog({
    systemConfig,
    onClose,
}: IUpdateSystemConfigDialogProps) {
    const { t } = useTranslation(['config']);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[20rem] rounded-md px-6 sm:max-w-[44rem]">
                <DialogHeader>
                    <DialogTitle>{t('config.update')}</DialogTitle>
                    <DialogDescription>
                        {t('config.updateSystemConfigDescription')}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[24rem]">
                    <UpdateSystemConfigForm
                        onSubmit={() => {
                            onClose(); // Đóng dialog sau khi submit
                        }}
                        systemConfig={systemConfig}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
