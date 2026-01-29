'use client'

import { useState } from 'react'
import { ArrowLeft, Send, QrCode, Copy, Check, User, Phone, Mail, Key } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PixPage() {
  const router = useRouter()
  const [step, setStep] = useState<'menu' | 'send' | 'receive'>('menu')
  const [pixType, setPixType] = useState<'cpf' | 'phone' | 'email' | 'random'>('cpf')
  const [pixKey, setPixKey] = useState('')
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)

  const myPixKey = '123.456.789-00'

  const handleCopyKey = () => {
    navigator.clipboard.writeText(myPixKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (step === 'send') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-md mx-auto px-6 py-4 flex items-center space-x-4">
            <button onClick={() => setStep('menu')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Enviar Pix</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 py-8 space-y-6">
          {/* Tipo de chave */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de chave Pix
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'cpf', icon: User, label: 'CPF/CNPJ' },
                { value: 'phone', icon: Phone, label: 'Telefone' },
                { value: 'email', icon: Mail, label: 'E-mail' },
                { value: 'random', icon: Key, label: 'Chave aleatória' },
              ].map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setPixType(type.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      pixType === type.value
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      pixType === type.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      pixType === type.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chave Pix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chave Pix do destinatário
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder={
                pixType === 'cpf' ? '000.000.000-00' :
                pixType === 'phone' ? '(00) 00000-0000' :
                pixType === 'email' ? 'email@exemplo.com' :
                'Chave aleatória'
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                R$
              </span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-16 pr-4 py-4 text-2xl font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Botão Continuar */}
          <button
            disabled={!pixKey || !amount}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </main>
      </div>
    )
  }

  if (step === 'receive') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-md mx-auto px-6 py-4 flex items-center space-x-4">
            <button onClick={() => setStep('menu')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Receber Pix</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 py-8 space-y-6">
          {/* QR Code */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
            <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
              <QrCode className="w-32 h-32 text-gray-400" />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              Mostre este QR Code para receber pagamentos
            </p>
          </div>

          {/* Minhas chaves */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Minhas chaves Pix</h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">CPF</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{myPixKey}</p>
                </div>
              </div>
              <button
                onClick={handleCopyKey}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Botão Compartilhar */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300">
            Compartilhar chave
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pix</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-4">
        <button
          onClick={() => setStep('send')}
          className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">Enviar Pix</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Transferir para qualquer pessoa</p>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
        </button>

        <button
          onClick={() => setStep('receive')}
          className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">Receber Pix</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gerar QR Code ou compartilhar chave</p>
            </div>
          </div>
          <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
        </button>
      </main>
    </div>
  )
}
