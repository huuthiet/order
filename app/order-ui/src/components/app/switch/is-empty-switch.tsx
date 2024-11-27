import { useTranslation } from 'react-i18next'

import { Label, Switch } from '@/components/ui'

interface IIsEmptySwitchProps {
  defaultValue: boolean
  onChange: (checked: boolean) => void
}

export default function IsEmptySwitch({
  defaultValue,
  onChange,
}: IIsEmptySwitchProps) {
  const { t } = useTranslation(['table'])
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Label>{t('table.isEmpty')}</Label>
        <Switch defaultChecked={defaultValue} onCheckedChange={onChange} />
      </div>
    </>
  )
}
