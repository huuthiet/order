import { useTranslation } from 'react-i18next';
import { SquareMenu } from 'lucide-react';

import OrderTabs from './order-tabs';

export default function OrderHistoryPage() {
  const { t } = useTranslation(['menu']);

  return (
    <div className="flex flex-col gap-1 px-2">
      <div className="sticky top-0 z-10 flex flex-col items-center bg-white">
        <span className="flex items-center justify-start w-full gap-1 text-lg">
          <SquareMenu />
          {t('order.title')}
        </span>
      </div>
      <OrderTabs />
    </div>
  );
}
