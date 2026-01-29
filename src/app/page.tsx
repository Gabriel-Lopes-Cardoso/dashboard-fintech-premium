'use client'

import { useState, useEffect } from 'react'
import { 
  Plus,
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  FileText,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  PieChart,
  Settings,
  Moon,
  Sun,
  Users,
  Target,
  Bell,
  Zap,
  ChevronRight,
  Tag,
  Building2,
  TrendingUpDown,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertCircle,
  Search,
  ChevronDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Repeat,
  Paperclip,
  CalendarIcon,
  Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

type Transaction = {
  id: number
  type: 'entrada' | 'saida'
  value: number
  category: string
  date: string
  description: string
  company?: string
  paymentMethod?: string
  isRecurring?: boolean
  recurringFrequency?: string
  attachment?: string
  includeInPatrimony: boolean
}

type Category = {
  name: string
  value: number
  color: string
  percent: number
  monthTotal: number
  subcategories?: { name: string; value: number }[]
}

type Company = {
  name: string
  status: 'ativo' | 'inativo' | 'bloqueado' | 'em-atraso'
  transactions: number
  monthTotal: number
  yearTotal: number
  weeklyAverage: number
}

type Notification = {
  id: number
  type: 'gasto' | 'entrada' | 'meta' | 'resumo' | 'padrao' | 'lembrete' | 'app' | 'seguranca'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

// Função de formatação de data consistente (evita hydration mismatch)
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export default function FinancialDashboard() {
  const [mounted, setMounted] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [transactionType, setTransactionType] = useState<'entrada' | 'saida'>('entrada')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'reports' | 'settings'>('dashboard')
  const [settingsSubmenu, setSettingsSubmenu] = useState<'main' | 'categories' | 'companies' | 'metas'>('main')
  const [dateFilter, setDateFilter] = useState<'7d' | '15d' | '30d' | 'mensal' | 'anual'>('30d')
  const [categorySearch, setCategorySearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState<'todos' | 'a-z' | 'ultima-entrega' | 'maior-volume'>('todos')
  const [companyStatusFilter, setCompanyStatusFilter] = useState<'todos' | 'ativo' | 'inativo' | 'bloqueado' | 'em-atraso'>('todos')
  const [hoveredBar, setHoveredBar] = useState<{ month: string; type: 'entrada' | 'saida'; value: number } | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)

  // Estados do formulário
  const [formValue, setFormValue] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formPaymentMethod, setFormPaymentMethod] = useState('')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [formIsRecurring, setFormIsRecurring] = useState(false)
  const [formRecurringFrequency, setFormRecurringFrequency] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formAttachment, setFormAttachment] = useState<File | null>(null)
  const [formIncludeInPatrimony, setFormIncludeInPatrimony] = useState(true)

  // Estados para Importar Planilha
  const [showImportSheet, setShowImportSheet] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<'entradas' | 'saidas' | 'ambas'>('ambas')
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importValidation, setImportValidation] = useState<{ valid: boolean; message: string }>({ valid: false, message: '' })

  // Estados para Relatórios
  const [showReports, setShowReports] = useState(false)
  const [reportPeriod, setReportPeriod] = useState<'dia' | 'semana' | 'mes' | 'ano' | 'personalizado'>('mes')
  const [reportType, setReportType] = useState<'entradas' | 'saidas' | 'comparativo' | 'categorias' | 'evolucao' | 'ranking' | 'auditoria'>('comparativo')

  // Estados financeiros
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'entrada', value: 5500.00, category: 'Vendas', date: '2024-01-15', description: 'Venda de produtos', company: 'Cliente A', paymentMethod: 'Pix', includeInPatrimony: true },
    { id: 2, type: 'saida', value: 245.80, category: 'Combustível', date: '2024-01-15', description: 'Abastecimento', company: 'Posto Shell', paymentMethod: 'Cartão crédito', includeInPatrimony: true },
    { id: 3, type: 'entrada', value: 1200.00, category: 'Fretes', date: '2024-01-14', description: 'Entregas realizadas', paymentMethod: 'Transferência', includeInPatrimony: true },
    { id: 4, type: 'saida', value: 850.00, category: 'Alimentação', date: '2024-01-14', description: 'Almoços da equipe', paymentMethod: 'Dinheiro', includeInPatrimony: true },
  ])

  // Estados de notificações
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'resumo',
      title: 'Resumo diário pronto!',
      message: 'Veja seus gastos de hoje.',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'app',
      title: 'Backup concluído',
      message: 'Seus dados foram salvos na nuvem com sucesso.',
      timestamp: new Date(Date.now() - 3600000),
      read: true
    }
  ])

  // Cálculos automáticos
  const totalEntradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.value, 0)

  const totalSaidas = transactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.value, 0)

  const balancoGeral = totalEntradas - totalSaidas

  const patrimonioLiquido = transactions
    .filter(t => t.includeInPatrimony)
    .reduce((sum, t) => {
      if (t.type === 'entrada') return sum + t.value
      if (t.type === 'saida') return sum - t.value
      return sum
    }, 0)

  const economyPercent = totalEntradas > 0 ? ((balancoGeral / totalEntradas) * 100) : 0
  const lucro = balancoGeral
  const saldoProjetado = patrimonioLiquido + 15000

  // Evita hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const categoryData: Category[] = [
    { 
      name: 'Combustível', 
      value: 2450, 
      color: 'from-red-500 to-red-600', 
      percent: 18.7,
      monthTotal: 2450,
      subcategories: [
        { name: 'Gasolina', value: 1800 },
        { name: 'Manutenção relacionada', value: 650 }
      ]
    },
    { name: 'Alimentação', value: 1850, color: 'from-orange-500 to-orange-600', percent: 14.1, monthTotal: 1850 },
    { name: 'Despesas empresa', value: 3200, color: 'from-yellow-500 to-yellow-600', percent: 24.5, monthTotal: 3200 },
    { name: 'Funcionários', value: 5500, color: 'from-blue-500 to-blue-600', percent: 42.0, monthTotal: 5500 },
  ]

  const companies: Company[] = [
    { name: 'Cliente A', status: 'ativo', transactions: 45, monthTotal: 12500, yearTotal: 98000, weeklyAverage: 3200 },
    { name: 'Cliente B', status: 'ativo', transactions: 32, monthTotal: 8900, yearTotal: 67000, weeklyAverage: 2100 },
    { name: 'Cliente C', status: 'em-atraso', transactions: 18, monthTotal: 4200, yearTotal: 38000, weeklyAverage: 950 },
    { name: 'Cliente D', status: 'inativo', transactions: 0, monthTotal: 0, yearTotal: 15000, weeklyAverage: 0 },
  ]

  const entradaCategories = ['Salário', 'Freelance', 'Pix recebido', 'Venda de produto', 'Premiação', 'Reembolso', 'Outros']
  const saidaCategories = ['Alimentação', 'Combustível', 'Contas', 'Aluguel', 'Dívidas', 'Compras', 'Lazer', 'Saúde', 'Transporte', 'Impostos', 'Outros']
  const paymentMethods = ['Pix', 'Dinheiro', 'Cartão crédito', 'Cartão débito', 'Boleto', 'Transferência', 'Outro']
  const recurringOptions = ['Semanal', 'Mensal', 'Trimestral']

  const maxCategoryValue = Math.max(...categoryData.map(c => c.value))

  const filteredCategories = categoryData.filter(cat => 
    typeof cat.name === 'string' && cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ativo': return darkMode ? 'text-emerald-400 bg-emerald-500/20' : 'text-emerald-600 bg-emerald-100'
      case 'inativo': return darkMode ? 'text-gray-400 bg-gray-500/20' : 'text-gray-600 bg-gray-100'
      case 'bloqueado': return darkMode ? 'text-red-400 bg-red-500/20' : 'text-red-600 bg-red-100'
      case 'em-atraso': return darkMode ? 'text-orange-400 bg-orange-500/20' : 'text-orange-600 bg-orange-100'
      default: return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'ativo': return <CheckCircle2 className="w-4 h-4" />
      case 'inativo': return <XCircle className="w-4 h-4" />
      case 'bloqueado': return <XCircle className="w-4 h-4" />
      case 'em-atraso': return <AlertTriangle className="w-4 h-4" />
      default: return null
    }
  }

  const sortedCompanies = [...companies].sort((a, b) => {
    switch(companyFilter) {
      case 'a-z': return a.name.localeCompare(b.name)
      case 'maior-volume': return b.monthTotal - a.monthTotal
      default: return 0
    }
  }).filter(company => 
    companyStatusFilter === 'todos' || company.status === companyStatusFilter
  )

  // Função para adicionar notificações
  const addNotification = (type: Notification['type'], title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Função para marcar notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  // Função para calcular gastos do dia
  const getTodayExpenses = () => {
    const today = new Date().toISOString().split('T')[0]
    return transactions
      .filter(t => t.type === 'saida' && t.date === today)
      .reduce((sum, t) => sum + t.value, 0)
  }

  // Função para calcular gastos de ontem
  const getYesterdayExpenses = () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    return transactions
      .filter(t => t.type === 'saida' && t.date === yesterday)
      .reduce((sum, t) => sum + t.value, 0)
  }

  // Função para calcular média semanal
  const getWeeklyAverage = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weekTransactions = transactions.filter(t => 
      t.type === 'saida' && new Date(t.date) >= weekAgo
    )
    const total = weekTransactions.reduce((sum, t) => sum + t.value, 0)
    return total / 7
  }

  // Função para calcular receita mensal
  const getMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return transactions
      .filter(t => 
        t.type === 'entrada' && 
        new Date(t.date).getMonth() === currentMonth &&
        new Date(t.date).getFullYear() === currentYear
      )
      .reduce((sum, t) => sum + t.value, 0)
  }

  // Função para calcular receita do mês passado
  const getLastMonthRevenue = () => {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const month = lastMonth.getMonth()
    const year = lastMonth.getFullYear()
    return transactions
      .filter(t => 
        t.type === 'entrada' && 
        new Date(t.date).getMonth() === month &&
        new Date(t.date).getFullYear() === year
      )
      .reduce((sum, t) => sum + t.value, 0)
  }

  const handleSaveTransaction = () => {
    const value = parseFloat(formValue.replace(',', '.'))
    
    if (!value || !formCategory || !formPaymentMethod) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: transactionType,
      value: value,
      category: formCategory,
      date: formDate,
      description: formDescription,
      paymentMethod: formPaymentMethod,
      isRecurring: formIsRecurring,
      recurringFrequency: formIsRecurring ? formRecurringFrequency : undefined,
      attachment: formAttachment?.name,
      includeInPatrimony: formIncludeInPatrimony
    }

    // Adiciona a nova transação no início da lista (mais recente primeiro)
    setTransactions([newTransaction, ...transactions])
    
    // Gera notificações baseadas na transação
    if (transactionType === 'saida') {
      const todayExpenses = getTodayExpenses() + value
      const yesterdayExpenses = getYesterdayExpenses()
      const weeklyAverage = getWeeklyAverage()
      const dailyLimit = 1000 // Limite diário de exemplo
      
      // Verifica se gastou mais que ontem
      if (todayExpenses > yesterdayExpenses && yesterdayExpenses > 0) {
        addNotification('gasto', 'Alerta de Gasto', 'Você gastou mais que ontem.')
      }
      
      // Verifica se atingiu 80% do limite diário
      if (todayExpenses >= dailyLimit * 0.8) {
        addNotification('gasto', 'Limite Diário', 'Hoje você atingiu 80% do limite diário de gastos.')
      }
      
      // Verifica se gastou acima de R$300
      if (value > 300) {
        addNotification('gasto', 'Gasto Elevado', 'Alerta: você registrou um gasto acima de R$300.')
      }
      
      // Verifica se gastou mais que a média semanal
      if (value > weeklyAverage && weeklyAverage > 0) {
        addNotification('gasto', 'Média Semanal', 'Você gastou mais do que sua média semanal.')
      }
    } else if (transactionType === 'entrada') {
      // Notificações de entrada
      addNotification('entrada', 'Entrada Registrada', 'Entrada registrada com sucesso.')
      
      const monthlyRevenue = getMonthlyRevenue() + value
      const lastMonthRevenue = getLastMonthRevenue()
      
      if (monthlyRevenue > lastMonthRevenue && lastMonthRevenue > 0) {
        addNotification('entrada', 'Receita Mensal', 'Sua receita mensal já ultrapassa o mês anterior.')
      }
      
      // Contar entradas da semana
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const weekEntries = transactions.filter(t => 
        t.type === 'entrada' && new Date(t.date) >= weekAgo
      ).length + 1
      
      addNotification('entrada', 'Entradas Semanais', `Você adicionou ${weekEntries} entradas esta semana.`)
    }
    
    // Resetar formulário
    setFormValue('')
    setFormCategory('')
    setFormPaymentMethod('')
    setFormDate(new Date().toISOString().split('T')[0])
    setFormIsRecurring(false)
    setFormRecurringFrequency('')
    setFormDescription('')
    setFormAttachment(null)
    setFormIncludeInPatrimony(true)
    setShowAddTransaction(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormAttachment(e.target.files[0])
    }
  }

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImportFile(file)
      
      // Simulação de preview e validação
      setImportPreview([
        { data: '15/01/2024', categoria: 'Vendas', valor: 'R$ 5.500,00', tipo: 'Entrada' },
        { data: '15/01/2024', categoria: 'Combustível', valor: 'R$ 245,80', tipo: 'Saída' },
        { data: '14/01/2024', categoria: 'Fretes', valor: 'R$ 1.200,00', tipo: 'Entrada' },
      ])
      
      setImportValidation({ valid: true, message: 'Arquivo pronto para importação.' })
    }
  }

  const handleImportData = () => {
    console.log('Importando dados:', { file: importFile, type: importType })
    addNotification('app', 'Planilha Importada', 'Planilha importada com sucesso.')
    setShowImportSheet(false)
    setImportFile(null)
    setImportPreview([])
    setImportValidation({ valid: false, message: '' })
  }

  // Função para exportar PDF
  const handleExportPDF = () => {
    const doc = new jsPDF()
    
    // Título
    doc.setFontSize(18)
    doc.text('Relatório Financeiro', 14, 22)
    
    // Informações do período
    doc.setFontSize(11)
    doc.text(`Período: ${reportPeriod}`, 14, 32)
    doc.text(`Tipo: ${reportType}`, 14, 38)
    doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 44)
    
    // Resumo financeiro
    doc.setFontSize(14)
    doc.text('Resumo Financeiro', 14, 56)
    doc.setFontSize(10)
    doc.text(`Total de Entradas: R$ ${totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 64)
    doc.text(`Total de Saídas: R$ ${totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 70)
    doc.text(`Balanço Geral: R$ ${balancoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 76)
    doc.text(`Patrimônio Líquido: R$ ${patrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 82)
    
    // Tabela de transações
    autoTable(doc, {
      startY: 92,
      head: [['Data', 'Categoria', 'Descrição', 'Valor', 'Forma', 'Tipo']],
      body: transactions.map(t => [
        formatDate(t.date),
        t.category,
        t.description,
        `${t.type === 'entrada' ? '+' : '-'}R$ ${t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        t.paymentMethod || '-',
        t.type === 'entrada' ? 'Entrada' : 'Saída'
      ]),
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237] }
    })
    
    // Salvar PDF
    doc.save(`relatorio-financeiro-${new Date().getTime()}.pdf`)
    addNotification('app', 'Relatório Exportado', 'Relatório exportado em PDF.')
  }

  // Função para exportar Excel
  const handleExportExcel = () => {
    // Criar planilha com resumo
    const resumoData = [
      ['Relatório Financeiro'],
      [''],
      ['Período', reportPeriod],
      ['Tipo', reportType],
      ['Data de geração', new Date().toLocaleDateString('pt-BR')],
      [''],
      ['Resumo Financeiro'],
      ['Total de Entradas', `R$ ${totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Total de Saídas', `R$ ${totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Balanço Geral', `R$ ${balancoGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Patrimônio Líquido', `R$ ${patrimonioLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      [''],
      ['Transações']
    ]
    
    // Adicionar cabeçalho das transações
    const transactionsData = [
      ['Data', 'Categoria', 'Descrição', 'Valor', 'Forma de Pagamento', 'Tipo'],
      ...transactions.map(t => [
        formatDate(t.date),
        t.category,
        t.description,
        t.value,
        t.paymentMethod || '-',
        t.type === 'entrada' ? 'Entrada' : 'Saída'
      ])
    ]
    
    // Criar workbook
    const wb = XLSX.utils.book_new()
    
    // Criar sheet de resumo
    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData)
    XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo')
    
    // Criar sheet de transações
    const wsTransactions = XLSX.utils.aoa_to_sheet(transactionsData)
    XLSX.utils.book_append_sheet(wb, wsTransactions, 'Transações')
    
    // Criar sheet de categorias
    const categoriesData = [
      ['Categoria', 'Valor', 'Percentual'],
      ...categoryData.map(c => [c.name, c.value, `${c.percent}%`])
    ]
    const wsCategories = XLSX.utils.aoa_to_sheet(categoriesData)
    XLSX.utils.book_append_sheet(wb, wsCategories, 'Categorias')
    
    // Salvar arquivo
    XLSX.writeFile(wb, `relatorio-financeiro-${new Date().getTime()}.xlsx`)
    addNotification('app', 'Relatório Exportado', 'Relatório exportado em Excel.')
  }

  // Função para exportar CSV
  const handleExportCSV = () => {
    // Criar dados CSV
    const csvData = [
      ['Data', 'Categoria', 'Descrição', 'Valor', 'Forma de Pagamento', 'Tipo'],
      ...transactions.map(t => [
        formatDate(t.date),
        t.category,
        t.description,
        t.value,
        t.paymentMethod || '-',
        t.type === 'entrada' ? 'Entrada' : 'Saída'
      ])
    ]
    
    // Converter para string CSV
    const csvContent = csvData.map(row => row.join(',')).join('\\n')
    
    // Criar blob e download
    const blob = new Blob(['\\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-financeiro-${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addNotification('app', 'Relatório Exportado', 'Relatório exportado em CSV.')
  }

  // Dados do fluxo de caixa com valores reais
  const cashFlowData = [
    { label: 'Jan', entrada: 8500, saida: 4500 },
    { label: 'Fev', entrada: 9200, saida: 5200 },
    { label: 'Mar', entrada: 7800, saida: 4800 },
    { label: 'Abr', entrada: 9500, saida: 5500 },
    { label: 'Mai', entrada: 8800, saida: 4200 },
    { label: 'Jun', entrada: 10000, saida: 3800 },
  ]

  const maxCashFlowValue = Math.max(...cashFlowData.flatMap(m => [m.entrada, m.saida]))

  // Renderiza loading state até montar no cliente
  if (!mounted) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0a0a0f]' : 'bg-gray-50'}`}>
      {/* Modal de Adicionar Entrada/Saída */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <Card className={`${darkMode ? 'bg-[#13131a] border-[#1f1f2e]' : 'bg-white'} border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <CardHeader className="sticky top-0 z-10 bg-inherit border-b border-inherit">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {transactionType === 'entrada' ? 'Adicionar Entrada' : 'Adicionar Saída'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAddTransaction(false)}
                  className={darkMode ? 'hover:bg-[#1f1f2e]' : ''}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Valor */}
              <div className="space-y-2">
                <Label htmlFor="value" className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Valor da {transactionType} *
                </Label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    R$
                  </span>
                  <Input
                    id="value"
                    type="text"
                    placeholder="0,00"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className={`pl-14 text-3xl font-bold h-16 ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white placeholder:text-gray-600' : ''}`}
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category" className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Categoria *
                </Label>
                <select
                  id="category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="">Selecione uma categoria</option>
                  {(transactionType === 'entrada' ? entradaCategories : saidaCategories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Forma de pagamento */}
              <div className="space-y-2">
                <Label htmlFor="payment" className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Forma de {transactionType === 'entrada' ? 'recebimento' : 'pagamento'} *
                </Label>
                <select
                  id="payment"
                  value={formPaymentMethod}
                  onChange={(e) => setFormPaymentMethod(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="">Selecione uma forma</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date" className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Data *
                </Label>
                <div className="relative">
                  <CalendarIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <Input
                    id="date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className={`pl-10 ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white' : ''}`}
                  />
                </div>
              </div>

              {/* Toggle: Incluir no Patrimônio Líquido */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Incluir no Patrimônio Líquido?
                  </Label>
                  <button
                    onClick={() => setFormIncludeInPatrimony(!formIncludeInPatrimony)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formIncludeInPatrimony 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                        : darkMode ? 'bg-[#2a2a3e]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formIncludeInPatrimony ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  {formIncludeInPatrimony 
                    ? 'Esta transação afetará o patrimônio líquido' 
                    : 'Esta transação não afetará o patrimônio líquido'}
                </p>
              </div>

              {/* Recorrente */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {transactionType === 'entrada' ? 'Entrada' : 'Despesa'} recorrente?
                  </Label>
                  <button
                    onClick={() => setFormIsRecurring(!formIsRecurring)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formIsRecurring 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                        : darkMode ? 'bg-[#2a2a3e]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formIsRecurring ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                {formIsRecurring && (
                  <div className="space-y-2 pl-4 border-l-2 border-purple-500/30">
                    <Label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Frequência de repetição
                    </Label>
                    <div className="space-y-2">
                      {recurringOptions.map((option) => (
                        <label
                          key={option}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            formRecurringFrequency === option
                              ? darkMode 
                                ? 'bg-purple-500/20 border border-purple-500/30' 
                                : 'bg-purple-50 border border-purple-200'
                              : darkMode
                                ? 'bg-[#1f1f2e] hover:bg-[#2a2a3e]'
                                : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="recurring"
                            value={option}
                            checked={formRecurringFrequency === option}
                            onChange={(e) => setFormRecurringFrequency(e.target.value)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className={`flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            <Repeat className="w-4 h-4" />
                            <span>{option}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descrição <span className="text-gray-500">(opcional)</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Pagamento do cliente João, Reembolso Uber..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className={darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white placeholder:text-gray-600' : ''}
                />
              </div>

              {/* Anexar comprovante */}
              <div className="space-y-2">
                <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Anexar comprovante <span className="text-gray-500">(opcional)</span>
                </Label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  darkMode ? 'border-[#2a2a3e] bg-[#1f1f2e]' : 'border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="attachment"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  <label htmlFor="attachment" className="cursor-pointer">
                    <Paperclip className={`w-8 h-8 mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formAttachment ? formAttachment.name : 'Clique para adicionar foto ou documento'}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                      PNG, JPG ou PDF (máx. 10MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Botões */}
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  onClick={handleSaveTransaction}
                  className={`flex-1 h-12 ${
                    transactionType === 'entrada'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/40'
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/40'
                  } text-white font-semibold`}
                >
                  Salvar {transactionType}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddTransaction(false)}
                  className={`flex-1 h-12 ${darkMode ? 'border-[#2a2a3e] text-gray-300 hover:bg-[#1f1f2e]' : ''}`}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Importar Planilha */}
      {showImportSheet && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <Card className={`${darkMode ? 'bg-[#13131a] border-[#1f1f2e]' : 'bg-white'} border shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto`}>
            <CardHeader className="sticky top-0 z-10 bg-inherit border-b border-inherit">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Importar Planilha
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowImportSheet(false)}
                  className={darkMode ? 'hover:bg-[#1f1f2e]' : ''}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instruções */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  Importe sua planilha de entradas e saídas nos formatos XLSX ou CSV.
                </p>
                <a 
                  href="#" 
                  className={`text-sm font-semibold underline mt-2 inline-block ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  Baixar modelo de planilha
                </a>
              </div>

              {/* Upload de arquivo */}
              <div className="space-y-2">
                <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Escolher arquivo
                </Label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  darkMode ? 'border-[#2a2a3e] bg-[#1f1f2e]' : 'border-gray-300 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    id="import-file"
                    onChange={handleImportFileChange}
                    className="hidden"
                    accept=".xlsx,.csv"
                  />
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {importFile ? importFile.name : 'Clique para selecionar arquivo'}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                      Formatos aceitos: XLSX, CSV
                    </p>
                  </label>
                </div>
              </div>

              {/* Tipo de planilha */}
              <div className="space-y-2">
                <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Selecionar tipo de planilha
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'entradas', label: 'Entradas', icon: TrendingUp, color: 'emerald' },
                    { id: 'saidas', label: 'Saídas', icon: TrendingDown, color: 'red' },
                    { id: 'ambas', label: 'Ambas', icon: TrendingUpDown, color: 'blue' },
                  ].map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setImportType(type.id as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          importType === type.id
                            ? darkMode
                              ? `border-${type.color}-500 bg-${type.color}-500/20`
                              : `border-${type.color}-500 bg-${type.color}-50`
                            : darkMode
                              ? 'border-[#2a2a3e] bg-[#1f1f2e] hover:bg-[#2a2a3e]'
                              : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          importType === type.id
                            ? `text-${type.color}-500`
                            : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {type.label}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preview da planilha */}
              {importPreview.length > 0 && (
                <div className="space-y-2">
                  <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Pré-visualização (5 primeiras linhas)
                  </Label>
                  <div className={`overflow-x-auto rounded-lg border ${darkMode ? 'border-[#2a2a3e]' : 'border-gray-300'}`}>
                    <table className="w-full">
                      <thead className={darkMode ? 'bg-[#1f1f2e]' : 'bg-gray-100'}>
                        <tr>
                          <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data</th>
                          <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categoria</th>
                          <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valor</th>
                          <th className={`px-4 py-2 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tipo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importPreview.map((row, index) => (
                          <tr key={index} className={darkMode ? 'border-t border-[#2a2a3e]' : 'border-t border-gray-200'}>
                            <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{row.data}</td>
                            <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{row.categoria}</td>
                            <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{row.valor}</td>
                            <td className={`px-4 py-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{row.tipo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Validação */}
              {importValidation.message && (
                <div className={`p-4 rounded-lg ${
                  importValidation.valid
                    ? darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                    : darkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {importValidation.valid ? (
                      <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    ) : (
                      <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    )}
                    <p className={`text-sm font-medium ${
                      importValidation.valid
                        ? darkMode ? 'text-emerald-300' : 'text-emerald-800'
                        : darkMode ? 'text-red-300' : 'text-red-800'
                    }`}>
                      {importValidation.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Botões */}
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  onClick={handleImportData}
                  disabled={!importValidation.valid}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/40 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Importar dados
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowImportSheet(false)}
                  className={`flex-1 h-12 ${darkMode ? 'border-[#2a2a3e] text-gray-300 hover:bg-[#1f1f2e]' : ''}`}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Relatórios */}
      {showReports && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <Card className={`${darkMode ? 'bg-[#13131a] border-[#1f1f2e]' : 'bg-white'} border shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto`}>
            <CardHeader className="sticky top-0 z-10 bg-inherit border-b border-inherit">
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Relatórios
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReports(false)}
                  className={darkMode ? 'hover:bg-[#1f1f2e]' : ''}
                >
                  <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filtros superiores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Período */}
                <div className="space-y-2">
                  <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Selecionar período
                  </Label>
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="dia">Dia</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mês</option>
                    <option value="ano">Ano</option>
                    <option value="personalizado">Personalizado</option>
                  </select>
                </div>

                {/* Tipo de relatório */}
                <div className="space-y-2">
                  <Label className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tipo de relatório
                  </Label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className={`w-full px-4 py-3 rounded-lg border ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e] text-white' : 'bg-white border-gray-300'}`}
                  >
                    <option value="entradas">Entradas</option>
                    <option value="saidas">Saídas</option>
                    <option value="comparativo">Comparativo entradas x saídas</option>
                    <option value="categorias">Gastos por categoria</option>
                    <option value="evolucao">Evolução financeira mensal</option>
                    <option value="ranking">Ranking de maiores despesas</option>
                    <option value="auditoria">Auditoria (lista completa)</option>
                  </select>
                </div>
              </div>

              {/* Visualizações gráficas */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Visualizações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gráfico de barras - Gastos por categoria */}
                  <div className={`p-6 rounded-lg border ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Gastos por Categoria
                      </h4>
                      <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex items-end justify-between h-40 space-x-2">
                      {categoryData.map((cat, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center space-y-2">
                          <div className="w-full flex items-end justify-center h-32">
                            <div 
                              className={`w-full bg-gradient-to-t ${cat.color} rounded-t-lg`}
                              style={{ height: `${(cat.value / maxCategoryValue) * 100}%` }}
                            />
                          </div>
                          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                            {cat.name.substring(0, 8)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gráfico de pizza - Distribuição */}
                  <div className={`p-6 rounded-lg border ${darkMode ? 'bg-[#1f1f2e] border-[#2a2a3e]' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Distribuição de Despesas
                      </h4>
                      <PieChart className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </div>
                    <div className="flex items-center justify-center h-40">
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 flex items-center justify-center">
                        <div className={`w-20 h-20 rounded-full ${darkMode ? 'bg-[#1f1f2e]' : 'bg-gray-50'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Listagem detalhada */}
              <div className="space-y-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Detalhamento
                </h3>
                <div className={`overflow-x-auto rounded-lg border ${darkMode ? 'border-[#2a2a3e]' : 'border-gray-300'}`}>
                  <table className="w-full">
                    <thead className={darkMode ? 'bg-[#1f1f2e]' : 'bg-gray-100'}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categoria</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descrição</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valor</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Forma</th>
                        <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tipo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className={darkMode ? 'border-t border-[#2a2a3e]' : 'border-t border-gray-200'}>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatDate(transaction.date)}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {transaction.category}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {transaction.description}
                          </td>
                          <td className={`px-4 py-3 text-sm font-semibold ${
                            transaction.type === 'entrada' 
                              ? darkMode ? 'text-emerald-400' : 'text-emerald-600'
                              : darkMode ? 'text-red-400' : 'text-red-600'
                          }`}>
                            {transaction.type === 'entrada' ? '+' : '-'}R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {transaction.paymentMethod || '-'}
                          </td>
                          <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.type === 'entrada'
                                ? darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                            }`}>
                              {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Botões de exportação */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
                <Button 
                  onClick={handleExportPDF}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/40 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button 
                  onClick={handleExportExcel}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/40 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </Button>
                <Button 
                  onClick={handleExportCSV}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/40 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header com design escuro moderno */}
      <header className={`${darkMode ? 'bg-[#13131a] border-[#1f1f2e]' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>FinanceHub Pro</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão Financeira Inteligente</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Filtro de período - melhorado com mais contraste */}
              <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg p-1">
                {[
                  { id: '7d', label: '7 dias' },
                  { id: '15d', label: '15 dias' },
                  { id: '30d', label: '30 dias' },
                  { id: 'mensal', label: 'Mensal' },
                  { id: 'anual', label: 'Anual' },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setDateFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      dateFilter === filter.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className={`rounded-full ${darkMode ? 'hover:bg-[#1f1f2e]' : ''}`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`rounded-full relative ${darkMode ? 'hover:bg-[#1f1f2e]' : ''}`}
              >
                <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Painel de Notificações */}
          {showNotifications && (
            <div className={`absolute top-full right-0 mt-2 w-96 ${darkMode ? 'bg-[#13131a] border-[#1f1f2e]' : 'bg-white border-gray-200'} border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto`}>
              <div className="p-4 border-b border-inherit">
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notificações</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-[#1f1f2e]">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-[#1f1f2e] cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === 'gasto' ? 'bg-red-500' :
                          notification.type === 'entrada' ? 'bg-emerald-500' :
                          notification.type === 'meta' ? 'bg-blue-500' :
                          notification.type === 'resumo' ? 'bg-purple-500' :
                          notification.type === 'padrao' ? 'bg-gray-500' :
                          notification.type === 'lembrete' ? 'bg-orange-500' :
                          notification.type === 'app' ? 'bg-indigo-500' :
                          'bg-gray-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-2`}>
                            {notification.timestamp.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Navigation Tabs - Design moderno */}
          <div className="flex items-center space-x-2 mt-6 overflow-x-auto pb-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'transactions', label: 'Transações', icon: FileText },
              { id: 'reports', label: 'Relatórios', icon: FileSpreadsheet },
              { id: 'settings', label: 'Configurações', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    if (tab.id === 'settings') {
                      setSettingsSubmenu('main')
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? darkMode 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-blue-500 text-white'
                      : darkMode
                        ? 'text-gray-400 hover:bg-[#1f1f2e] hover:text-gray-200'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>