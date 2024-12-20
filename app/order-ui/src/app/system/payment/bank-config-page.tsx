import { useTranslation } from 'react-i18next'

import { ScrollArea } from '@/components/ui'
import { useGetBankConnector } from '@/hooks'
import {
  CreateBankConnectorDialog,
  UpdateBankConnectorDialog,
} from '@/components/app/dialog'
import BankCard from './bank-card'
import { PasswordInput } from '@/components/ui/password-input'

export default function BankConfigPage() {
  const { t } = useTranslation('bank')
  const { data: bankConfig } = useGetBankConnector()

  const bankConfigData = bankConfig?.result
  return (
    <div className="flex h-full flex-row gap-2">
      {/* Menu Section - Scrollable */}
      <ScrollArea className="flex-1">
        <div className={`transition-all duration-300 ease-in-out`}>
          <div className="sticky top-0 z-10 flex flex-col items-center gap-2">
            <div className="flex w-full justify-end gap-2">
              {!bankConfigData && <CreateBankConnectorDialog />}
              <UpdateBankConnectorDialog bankConnector={bankConfigData} />
            </div>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 lg:flex-row">
              <div className="w-full items-center justify-center xl:col-span-2">
                <BankCard bankCardData={bankConfigData} />
              </div>
              {bankConfigData && (
                <div className="grid w-full grid-cols-1 items-center justify-between rounded-sm border p-4 xl:col-span-3">
                  <div className="col-span-1 flex h-full flex-col justify-between gap-2 px-4">
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.xProviderId')}
                      </h3>
                      <PasswordInput
                        readOnly
                        value={bankConfigData.xProviderId}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.xOwnerNumber')}
                      </h3>
                      <PasswordInput
                        readOnly
                        value={bankConfigData.xOwnerNumber}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.xOwnerType')}
                      </h3>
                      <PasswordInput
                        readOnly
                        value={bankConfigData.xOwnerType}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.beneficiaryName')}
                      </h3>
                      <PasswordInput
                        readOnly
                        value={bankConfigData.beneficiaryName}
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <h3 className="col-span-1 text-sm font-medium">
                        {t('bank.virtualAccountPrefix')}
                      </h3>
                      <PasswordInput
                        readOnly
                        value={bankConfigData.virtualAccountPrefix}
                      />
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
