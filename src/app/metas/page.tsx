'use client'

import { useState } from 'react'
import { ArrowLeft, Target, Plus, TrendingUp, Calendar, DollarSign, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MetasPage() {
  const router = useRouter()
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [goalName, setGoalName] = useState('')
  const [goalAmount, setGoalAmount] = useState('')
  const [goalDate, setGoalDate] = useState('')

  const goals = [
    {
      id: 1,
      name: 'Viagem para Europa',
      target: 15000.00,
      current: 8500.00,
      deadline: 'Dez 2024',
      icon: '✈️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      name: 'Reserva de emergência',
      target: 10000.00,
      current: 6200.00,
      deadline: 'Jun 2024',
      icon: '🛡️',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 3,
      name: 'Novo notebook',
      target: 5000.00,
      current: 4800.00,
      deadline: 'Mar 2024',
      icon: '💻',
      color: 'from-purple-500 to-pink-500'
    },
  ]

  if (showNewGoal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-md mx-auto px-6 py-4 flex items-center space-x-4">
            <button onClick={() => setShowNewGoal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nova Meta</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 py-8 space-y-6">
          {/* Nome da meta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome da meta
            </label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Ex: Viagem, Carro novo, Reserva..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Valor alvo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor alvo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                R$
              </span>
              <input
                type="text"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="0,00"
                className="w-full pl-16 pr-4 py-4 text-2xl font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Data alvo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data alvo
            </label>
            <input
              type="date"
              value={goalDate}
              onChange={(e) => setGoalDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Ícone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Escolha um ícone
            </label>
            <div className="grid grid-cols-6 gap-3">
              {['✈️', '🏠', '🚗', '💻', '📱', '🎓', '💰', '🛡️', '🎯', '🎁', '🏖️', '🎮'].map((icon) => (
                <button
                  key={icon}
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl transition-colors"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Botão criar */}
          <button
            disabled={!goalName || !goalAmount || !goalDate}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            Criar meta
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Metas Financeiras</h1>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full transition-all"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-8 space-y-6">
        {/* Resumo */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8" />
            <div>
              <p className="text-purple-100 text-sm">Total em metas</p>
              <p className="text-3xl font-bold">
                R$ {goals.reduce((acc, goal) => acc + goal.current, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-purple-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">
              {goals.length} metas ativas • Faltam R$ {goals.reduce((acc, goal) => acc + (goal.target - goal.current), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Lista de metas */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const isComplete = progress >= 100

            return (
              <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${goal.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{goal.deadline}</span>
                      </div>
                    </div>
                  </div>
                  {isComplete && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${goal.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      R$ {goal.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      R$ {goal.target.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {!isComplete && (
                  <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Adicionar valor</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
