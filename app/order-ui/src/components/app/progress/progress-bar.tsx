import { DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

import { OrderStatus } from '@/types'

interface ProgressBarProps {
  step?: OrderStatus
}

export default function ProgressBar({ step }: ProgressBarProps) {
  const { t } = useTranslation('progress')
  const currentStep = step
  return (
    <ol className="flex items-center justify-center w-full py-6 space-x-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:space-x-4 rtl:space-x-reverse">
      {/* Step 1 */}
      <li
        className={`flex items-center ${currentStep === OrderStatus.PENDING ? 'text-primary dark:text-primary' : ''}`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 text-xs border rounded-full me-2 shrink-0 ${currentStep === OrderStatus.PENDING
            ? 'border-primary dark:border-primary'
            : 'border-gray-500 dark:border-gray-400'
            }`}
        >
          1
        </span>
        <span className="hidden sm:text-sm sm:inline-flex sm:ms-1">
          {t('progress.pending')}
        </span>
        <DoubleArrowRightIcon className="w-4 h-4 ms-2 sm:ms-4 rtl:rotate-180" />
      </li>
      {/* Step 2 */}
      <li
        className={`flex items-center ${currentStep === OrderStatus.PAID ? 'text-primary dark:text-primary' : ''}`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 text-xs border rounded-full me-2 shrink-0 ${currentStep === OrderStatus.PAID
            ? 'border-primary dark:border-primary'
            : 'border-gray-500 dark:border-gray-400'
            }`}
        >
          2
        </span>
        <span className="hidden sm:text-sm sm:inline-flex sm:ms-2">
          {t('progress.paid')}
        </span>
        <DoubleArrowRightIcon className="w-4 h-4 ms-2 sm:ms-4 rtl:rotate-180" />
      </li>
      {/* Step 3 */}
      <li
        className={`flex items-center ${currentStep === OrderStatus.SHIPPING ? 'text-primary dark:text-primary' : ''}`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 text-xs border rounded-full me-2 shrink-0 ${currentStep === OrderStatus.SHIPPING
            ? 'border-primary dark:border-primary'
            : 'border-gray-500 dark:border-gray-400'
            }`}
        >
          3
        </span>
        <span className="hidden sm:text-sm sm:inline-flex sm:ms-2">
          {t('progress.shipping')}
        </span>
        <DoubleArrowRightIcon className="w-4 h-4 ms-2 sm:ms-4 rtl:rotate-180" />
      </li>
      {/* Step 4 */}
      <li
        className={`flex items-center ${currentStep === OrderStatus.COMPLETED ? 'text-primary dark:text-primary' : ''}`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 text-xs border rounded-full me-2 shrink-0 ${currentStep === OrderStatus.SHIPPING
            ? 'border-primary dark:border-primary'
            : 'border-gray-500 dark:border-gray-400'
            }`}
        >
          4
        </span>
        <span className="hidden sm:text-sm sm:inline-flex sm:ms-2">
          {t('progress.completed')}
        </span>
      </li>
    </ol>
  )
}
