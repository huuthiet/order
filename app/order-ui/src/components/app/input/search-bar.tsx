import { Search } from 'lucide-react'

import { Input } from '@/components/ui'
import { useTranslation } from 'react-i18next'

export default function SearchBar() {
  const { t } = useTranslation('common')
  return (
    <div className="relative w-96 min-w-40 max-w-96">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input type="search" placeholder={t('common.search')} className="pl-10" />
    </div>
  )
}
