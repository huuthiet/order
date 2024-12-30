import { useTranslation } from 'react-i18next';
import { SquareMenu } from 'lucide-react';

import OrderTabs from './order-tabs';

export default function OrderHistoryPage() {
  const { t } = useTranslation(['menu']);

  return (
    <div className="flex flex-col gap-1">
      <div className="sticky z-10 flex flex-col items-center bg-white -top-1">
        <span className="flex items-center justify-start w-full gap-1 text-lg">
          <SquareMenu />
          {t('order.title')}
        </span>
      </div>
      <OrderTabs />
    </div>
  );
}
