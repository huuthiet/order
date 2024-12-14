import { useTranslation } from 'react-i18next'

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
    <div className="flex flex-row h-full gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`px-4 transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2 pr-4 bg-background">
            <div className="flex justify-end w-full gap-2">
              {!bankConfigData && <CreateBankConnectorDialog />}
              <UpdateBankConnectorDialog bankConnector={bankConfigData} />
            </div>
            <div className="grid justify-start w-full grid-cols-1 gap-4 mt-6 xl:grid-cols-5">
              <div className="items-center justify-center w-full xl:col-span-2">
                <BankCard bankCardData={bankConfigData} />
              </div>
              {bankConfigData && (
                <div className="grid items-center justify-between w-full grid-cols-1 p-4 border rounded-sm xl:col-span-3">
                  <div className="flex flex-col justify-between h-full col-span-1 gap-1 px-4">
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
