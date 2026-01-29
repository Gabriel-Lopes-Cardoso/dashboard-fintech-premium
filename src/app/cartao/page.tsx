'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Eye, EyeOff, Lock, Unlock, Copy, Check, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CartaoPage() {
  const router = useRouter()
  const [showNumber, setShowNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [copied, setCopied] = useState(false)

  const cardNumber = '5412 7534 8901 2345'
  const cardCVV = '123'
  const cardExpiry = '12/28'
  const cardLimit = 5000.00
  const cardUsed = 1247.80

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(cardNumber.replace(/\s/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meu Cartão</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-6">
        {/* Cartão Virtual */}
        <div className="relative">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-6 text-white shadow-2xl aspect-[1.586/1]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-purple-100 text-xs mb-1">Cartão Virtual</p>
                <p className="font-semibold text-sm">João Silva</p>
              </div>
              <CreditCard className="w-8 h-8 text-white/80" />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-purple-100 text-xs mb-2">Número do cartão</p>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-mono tracking-wider">
                    {showNumber ? cardNumber : '•••• •••• •••• ' + cardNumber.slice(-4)}
                  </p>
                  <button
                    onClick={() => setShowNumber(!showNumber)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {showNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs mb-1">Validade</p>
                  <p className="font-mono">{cardExpiry}</p>
                </div>
                <div>
                  <p className="text-purple-100 text-xs mb-1">CVV</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono">{showCVV ? cardCVV : '•••'}</p>
                    <button
                      onClick={() => setShowCVV(!showCVV)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg flex items-center space-x-2 ${
            isBlocked ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {isBlocked ? <Lock className="w-4 h-4 text-white" /> : <Unlock className="w-4 h-4 text-white" />}
            <span className="text-white text-sm font-medium">
              {isBlocked ? 'Bloqueado' : 'Ativo'}
            </span>
          </div>
        </div>

        {/* Limite */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Limite disponível</h3>
            <button className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline">
              Ajustar
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {(cardLimit - cardUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                de R$ {cardLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(cardUsed / cardLimit) * 100}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Você já usou R$ {cardUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} este mês
            </p>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCopyNumber}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
          >
            {copied ? (
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {copied ? 'Copiado!' : 'Copiar número'}
            </span>
          </button>

          <button
            onClick={() => setIsBlocked(!isBlocked)}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center space-y-2"
          >
            {isBlocked ? (
              <Unlock className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isBlocked ? 'Desbloquear' : 'Bloquear'}
            </span>
          </button>
        </div>

        {/* Opções do cartão */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y divide-gray-100 dark:divide-gray-700">
          {[
            { icon: Plus, label: 'Gerar cartão virtual temporário', color: 'purple' },
            { icon: CreditCard, label: 'Solicitar cartão físico', color: 'blue' },
            { icon: Lock, label: 'Alterar senha do cartão', color: 'emerald' },
          ].map((option, index) => {
            const Icon = option.icon
            return (
              <button
                key={index}
                className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className={`w-10 h-10 bg-${option.color}-100 dark:bg-${option.color}-900/30 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${option.color}-600 dark:text-${option.color}-400`} />
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
