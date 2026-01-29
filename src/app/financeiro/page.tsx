'use client'

import { useState } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, Calendar, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FinanceiroPage() {
  const router = useRouter()
  const [selectedMonth, setSelectedMonth] = useState('Janeiro 2024')

  const monthlyData = {
    income: 5500.00,
    expenses: 3247.80,
    balance: 2252.20,
    categories: [
      { name: 'Alimentação', amount: 847.50, percentage: 26, color: 'from-orange-500 to-red-500' },
      { name: 'Transporte', amount: 450.00, percentage: 14, color: 'from-blue-500 to-cyan-500' },
      { name: 'Moradia', amount: 1200.00, percentage: 37, color: 'from-purple-500 to-pink-500' },
      { name: 'Lazer', amount: 350.30, percentage: 11, color: 'from-emerald-500 to-teal-500' },
      { name: 'Outros', amount: 400.00, percentage: 12, color: 'from-yellow-500 to-orange-500' },
    ]
  }

  const subscriptions = [
    { name: 'Netflix', amount: 49.90, nextBilling: '15 Fev', icon: '🎬' },
    { name: 'Spotify', amount: 21.90, nextBilling: '20 Fev', icon: '🎵' },
    { name: 'Amazon Prime', amount: 14.90, nextBilling: '25 Fev', icon: '📦' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Controle Financeiro</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-6">
        {/* Seletor de mês */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">{selectedMonth}</span>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Resumo mensal */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="text-xs opacity-90 mb-1">Receitas</p>
            <p className="text-lg font-bold">R$ {monthlyData.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-4 text-white">
            <TrendingDown className="w-6 h-6 mb-2" />
            <p className="text-xs opacity-90 mb-1">Despesas</p>
            <p className="text-lg font-bold">R$ {monthlyData.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-4 text-white">
            <DollarSign className="w-6 h-6 mb-2" />
            <p className="text-xs opacity-90 mb-1">Saldo</p>
            <p className="text-lg font-bold">R$ {monthlyData.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Gráfico de categorias */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">Gastos por categoria</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {monthlyData.categories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.percentage}% do total</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assinaturas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Assinaturas ativas</h3>
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              R$ {subscriptions.reduce((acc, sub) => acc + sub.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
            </span>
          </div>

          <div className="space-y-3">
            {subscriptions.map((sub, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl">
                    {sub.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{sub.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Próxima cobrança: {sub.nextBilling}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  R$ {sub.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300">
            Ver relatório completo
          </button>
          <button className="bg-white dark:bg-gray-800 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 font-semibold py-4 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
            Exportar dados
          </button>
        </div>
      </main>
    </div>
  )
}
