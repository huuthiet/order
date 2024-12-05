import { Label, Switch } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface IIsTemplateSwitchProps {
    defaultValue: boolean
    onChange: (checked: boolean) => void
}

export default function IsTemplateSwitch({ defaultValue, onChange }: IIsTemplateSwitchProps) {
    const { t } = useTranslation(['menu'])
    return (
        <>
            <div className="flex items-center gap-4 py-2">
                <Label>{t('menu.isTemplate')}</Label>
                <Switch defaultChecked={defaultValue} onCheckedChange={onChange} />
            </div>
        </>
    )
}
