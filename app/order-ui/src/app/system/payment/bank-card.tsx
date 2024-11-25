import { CreditCard, Shield } from 'lucide-react'

import { IBankConnector } from '@/types'

interface BankCardProps {
  bankCardData?: IBankConnector
}

export default function BankCard({ bankCardData }: BankCardProps) {
  return (
    <div className="relative h-56 w-96 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 p-6 text-white shadow-xl">
      {/* Decorative Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-black/20 opacity-30" />

      {/* Bank Information */}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        {/* Bank Logo */}
        <div className="flex items-center gap-2">
          <CreditCard className="h-10 w-10" />
          <span className="text-lg font-bold uppercase tracking-wide">
            {bankCardData?.xService || 'My Bank'}
          </span>
        </div>
        {/* Card Type */}
        <Shield className="h-8 w-8" />
      </div>

      {/* Card Number */}
      <div className="z-10 mb-6 flex items-center font-mono text-2xl tracking-widest">
        <span>{bankCardData?.virtualAccountPrefix.slice(-4)} **** ****</span>
      </div>

      {/* Card Holder and Expiry */}
      <div className="relative z-10 flex justify-between text-sm">
        <div>
          <span className="block uppercase">Card Holder</span>
          <span className="font-semibold">
            {bankCardData?.beneficiaryName || 'Card Holder'}
          </span>
        </div>
        <div className="text-right">
          <span className="block uppercase">Card number</span>
          <span className="font-semibold">
            {bankCardData?.xOwnerNumber || 'MM/YY'}
          </span>
        </div>
      </div>

      {/* Bottom Decorations */}
      <div className="absolute bottom-4 left-4 z-0 h-12 w-12 rounded-full bg-gradient-to-r from-white/40 to-black/40 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-6 right-6 z-0 h-8 w-20 rounded-full bg-gradient-to-r from-white/20 to-black/20 opacity-30 blur-3xl"></div>
    </div>
  )
}
