import { useTranslation } from 'react-i18next'

import { BreadcrumbComponent } from '@/components/app/breadcrumb'
import { ScrollArea } from '@/components/ui'
import { useGetBankConnector } from '@/hooks'
import {
  CreateBankConnectorDialog,
  UpdateBankConnectorDialog,
} from '@/components/app/dialog'
import BankCard from './bank-card'

export default function BankConfigPage() {
  const { t } = useTranslation('bank')
  const { data: bankConfig } = useGetBankConnector()

  const bankConfigData = bankConfig?.result
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`px-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 bg-background py-3 pr-4">
            <div className="flex w-full flex-row items-center justify-between">
              <BreadcrumbComponent />
            </div>
            <div className="flex w-full justify-end gap-2">
              {!bankConfigData && <CreateBankConnectorDialog />}
              <UpdateBankConnectorDialog bankConnector={bankConfigData} />
            </div>
            <div className="mt-6 grid w-full grid-cols-5 justify-start gap-4">
              <div className="col-span-2 w-full items-center justify-center">
                <BankCard bankCardData={bankConfigData} />
              </div>
              {bankConfigData && (
                <div className="col-span-3 grid w-full grid-cols-1 items-center justify-between rounded-sm border p-4">
                  <div className="col-span-1 flex h-full flex-col justify-between gap-1 px-4">
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.xProviderId')}
                      </h3>
                      <p className="text-sm font-semibold">
                        {bankConfigData.xProviderId}
                      </p>
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.xOwnerNumber')}
                      </h3>
                      <span className="text-sm font-semibold">
                        {bankConfigData.xOwnerNumber}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.xOwnerType')}
                      </h3>
                      <span className="text-sm font-semibold">
                        {bankConfigData.xOwnerType}
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.beneficiaryName')}
                      </h3>
                      <p className="text-sm font-semibold">
                        {bankConfigData.beneficiaryName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.virtualAccountPrefix')}
                      </h3>
                      <span className="text-sm font-semibold">
                        {bankConfigData.virtualAccountPrefix}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
