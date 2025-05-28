"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Award,
  Monitor,
  Wifi,
  Headphones,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Star,
} from "lucide-react"

export default function ProcessoSeletivo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [processId] = useState(`PS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
  const [userLocation, setUserLocation] = useState<string>("")
  const [vagasRestantes, setVagasRestantes] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
    aceiteTermos: false,
  })

  const [requisitos, setRequisitos] = useState({
    ensinoMedio: false,
    informaticaBasica: false,
    boaComunicacao: false,
    disponibilidadeHorario: false,
  })

  const steps = ["Vaga", "Dados", "Requisitos", "Certificação"]

  const progress = ((currentStep + 1) / steps.length) * 100

  // Estados brasileiros
  const estadosBrasileiros = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ]

  // Detectar localização do usuário
  useEffect(() => {
    const detectLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=pt`,
                )
                const data = await response.json()
                const cidade = data.city || data.locality || "sua região"
                setUserLocation(cidade)
                setVagasRestantes(Math.floor(Math.random() * 8) + 3)
              } catch (error) {
                setUserLocation("sua região")
                setVagasRestantes(Math.floor(Math.random() * 8) + 3)
              }
            },
            () => {
              detectLocationByIP()
            },
          )
        } else {
          detectLocationByIP()
        }
      } catch (error) {
        setUserLocation("sua região")
        setVagasRestantes(Math.floor(Math.random() * 8) + 3)
      }
    }

    const detectLocationByIP = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        const cidade = data.city || "sua região"
        setUserLocation(cidade)
        setVagasRestantes(Math.floor(Math.random() * 8) + 3)
      } catch (error) {
        setUserLocation("sua região")
        setVagasRestantes(Math.floor(Math.random() * 8) + 3)
      }
    }

    detectLocation()
  }, [])

  const getButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Iniciar Candidatura"
      case 1:
        return "Continuar"
      case 2:
        return "Validar"
      default:
        return "Continuar"
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (value: string) => {
    setFormData((prev) => ({ ...prev, email: value }))

    // Validar apenas se o campo não estiver vazio
    if (value.length > 0) {
      setEmailValid(validateEmail(value))
    } else {
      setEmailValid(true) // Não mostrar erro se campo estiver vazio
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTelefoneChange = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "")

    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11)

    // Aplica a formatação brasileira
    let formatted = limitedNumbers

    if (limitedNumbers.length >= 1) {
      formatted = `(${limitedNumbers.slice(0, 2)}`
    }
    if (limitedNumbers.length >= 3) {
      formatted = `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}`
    }
    if (limitedNumbers.length >= 8) {
      formatted = `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`
    }

    setFormData((prev) => ({ ...prev, telefone: formatted }))
  }

  const handleRequisitoChange = (field: string, checked: boolean) => {
    setRequisitos((prev) => ({ ...prev, [field]: checked }))
  }

  const saveToLocalStorage = (data: any) => {
    try {
      const existingData = localStorage.getItem("candidatos") || "[]"
      const candidatos = JSON.parse(existingData)
      candidatos.push(data)
      localStorage.setItem("candidatos", JSON.stringify(candidatos))
      console.log("Dados salvos com sucesso:", data)
      return { success: true }
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      return { success: false, error: String(error) }
    }
  }

  const nextStep = async () => {
    if (currentStep === 1) {
      setIsSaving(true)
      try {
        const now = new Date()
        const dataHora = now.toLocaleString("pt-BR")

        const dadosParaSalvar = {
          processId,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cidade: formData.cidade,
          estado: formData.estado,
          dataHora,
          userLocation,
        }

        saveToLocalStorage(dadosParaSalvar)
      } catch (error) {
        console.error("Erro ao salvar dados:", error)
      } finally {
        setIsSaving(false)
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handlePayment = () => {
    window.open("https://seu-link-de-pagamento.com", "_blank")
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-[#002c5f] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold">EmpregaJá</h1>
              <div className="bg-[#002c5f] border-2 border-white rounded-full p-1 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <Badge className="bg-[#002c5f] text-white border border-white text-xs">Verificado</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Vagas */}
      {currentStep === 0 && userLocation && (
        <div className="bg-[#002c5f] bg-opacity-90 text-white py-2 shadow-md">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 text-center text-sm">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">
                {vagasRestantes} vagas em {userLocation}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#002c5f]">
              {currentStep + 1}/{steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={index}
                className={`text-xs font-medium ${index <= currentStep ? "text-[#002c5f]" : "text-gray-400"}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="p-4 md:p-6">
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-3 bg-[#002c5f] text-white border-[#002c5f]">
                    Home Office
                  </Badge>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Atendente de Home Office</h2>
                  <p className="text-gray-600 text-sm md:text-base">
                    Trabalhe remotamente em uma empresa consolidada no mercado brasileiro.
                  </p>
                </div>

                {/* Empresa - Compacta */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Building2 className="w-5 h-5 text-[#002c5f]" />
                    <h3 className="text-lg font-semibold text-gray-900">Conecta Soluções</h3>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Empresa líder em atendimento ao cliente com 15+ anos de experiência e mais de 2.000 colaboradores.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-[#002c5f]" />
                      <span>Plano de carreira</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-[#002c5f]" />
                      <span>Treinamentos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-[#002c5f]" />
                      <span>Ambiente colaborativo</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-[#002c5f]" />
                      <span>Tecnologia moderna</span>
                    </div>
                  </div>
                </div>

                {/* Informações da Vaga - Grid Compacto */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <DollarSign className="w-4 h-4 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Salário</p>
                      <p className="text-xs text-gray-600">R$ 1.800 - R$ 2.200</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <Clock className="w-4 h-4 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Jornada</p>
                      <p className="text-xs text-gray-600">44h semanais</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <MapPin className="w-4 h-4 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Modalidade</p>
                      <p className="text-xs text-gray-600">100% Remoto</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                    <Users className="w-4 h-4 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Vagas</p>
                      <p className="text-xs text-gray-600">
                        {userLocation ? `${vagasRestantes} em ${userLocation}` : "20 posições"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Responsabilidades - Compactas */}
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-3">Principais Atividades</h3>
                  <ul className="space-y-2">
                    {[
                      "Atendimento via telefone e chat",
                      "Registro de solicitações no sistema",
                      "Esclarecimento de dúvidas",
                      "Suporte técnico básico",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#002c5f] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefícios - Compactos */}
                <div className="bg-[#f0f4f8] border border-[#d1dce5] rounded-lg p-4">
                  <h3 className="text-base font-medium text-[#002c5f] mb-3">Benefícios</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Vale alimentação", "Plano de saúde", "Auxílio internet", "Plano de carreira"].map(
                      (benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-[#002c5f]" />
                          <span className="text-xs text-[#002c5f]">{benefit}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Dados Pessoais</h2>
                  <p className="text-gray-600 text-sm">Preencha suas informações básicas</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                      Nome Completo *
                    </Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      placeholder="Digite seu nome completo"
                      className="border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className={`border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f] ${
                        !emailValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                      }`}
                    />
                    {!emailValid && (
                      <p className="text-xs text-red-500">Digite um e-mail válido (exemplo@dominio.com)</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                      Telefone/WhatsApp *
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleTelefoneChange(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f]"
                      maxLength={15}
                    />
                    <p className="text-xs text-gray-500">Formato: (11) 99999-9999</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                        Cidade *
                      </Label>
                      <Input
                        id="cidade"
                        value={formData.cidade}
                        onChange={(e) => handleInputChange("cidade", e.target.value)}
                        placeholder="Digite sua cidade"
                        className="border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                        Estado *
                      </Label>
                      <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                        <SelectTrigger className="border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f]">
                          <SelectValue placeholder="Selecione o estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estadosBrasileiros.map((estado) => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f0f4f8] border border-[#d1dce5] rounded-lg p-3">
                  <p className="text-sm text-[#002c5f]">
                    <strong>Info:</strong> Entraremos em contato via WhatsApp para agendar entrevista online.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Requisitos</h2>
                  <p className="text-gray-600 text-sm">Confirme se atende aos requisitos</p>
                </div>

                <div className="space-y-4">
                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-gray-900">Requisitos Obrigatórios</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {[
                          { id: "ensinoMedio", label: "Ensino médio completo" },
                          { id: "informaticaBasica", label: "Informática básica" },
                          { id: "boaComunicacao", label: "Boa comunicação" },
                          { id: "disponibilidadeHorario", label: "Disponibilidade comercial" },
                        ].map((req) => (
                          <li key={req.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={req.id}
                              checked={requisitos[req.id as keyof typeof requisitos]}
                              onCheckedChange={(checked) => handleRequisitoChange(req.id, checked as boolean)}
                              className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f]"
                            />
                            <Label htmlFor={req.id} className="text-sm text-gray-700">
                              {req.label}
                            </Label>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-gray-900">Requisitos Técnicos</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: Monitor, title: "Computador", desc: "Windows 10+" },
                          { icon: Wifi, title: "Internet", desc: "10MB estável" },
                          { icon: Headphones, title: "Headset", desc: "Para atendimento" },
                          { icon: Shield, title: "Ambiente", desc: "Local silencioso" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <item.icon className="w-4 h-4 text-[#002c5f]" />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                              <p className="text-xs text-gray-600">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Checkbox de confirmação destacado */}
                  <Card className="border-[#002c5f] border-2 bg-[#f8fafc]">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="termos"
                          checked={formData.aceiteTermos}
                          onCheckedChange={(checked) => handleInputChange("aceiteTermos", checked as boolean)}
                          className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f] mt-1"
                        />
                        <div>
                          <Label htmlFor="termos" className="text-sm font-medium text-[#002c5f] cursor-pointer">
                            Confirmo que atendo a todos os requisitos *
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">Confirmação obrigatória para prosseguir</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#002c5f] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidatura Aprovada!</h2>
                  <p className="text-gray-600 text-sm">Você atende aos requisitos da vaga</p>
                </div>

                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-900">Certificação Obrigatória</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-gray-700 text-sm">
                      Todos os colaboradores devem realizar nossa certificação profissional antes do início.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Conteúdo:</h4>
                      <ul className="space-y-1 text-xs text-gray-700">
                        {[
                          "Atendimento ao cliente",
                          "Sistemas da empresa",
                          "Comunicação profissional",
                          "Certificado digital",
                        ].map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-[#002c5f]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Destaque do valor */}
                    <div className="bg-[#002c5f] text-white rounded-lg p-4 shadow-md">
                      <h4 className="font-semibold text-lg mb-2 text-center">Investimento</h4>
                      <div className="text-center">
                        <div className="text-2xl font-bold mb-2">R$ 19,90</div>
                        <p className="text-sm mb-3">Valor necessário para iniciar a certificação obrigatória.</p>
                      </div>
                      <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                        <p className="font-medium mb-2 text-center text-sm">Incluído:</p>
                        <ul className="space-y-1 text-xs">
                          {[
                            "Plataforma de treinamento",
                            "Materiais didáticos",
                            "Suporte técnico",
                            "Certificado digital",
                          ].map((item, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="w-3 h-3 text-white flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800 text-sm">Importante:</h4>
                          <p className="text-xs text-amber-700">
                            Certificação deve ser concluída em 7 dias. Vagas preenchidas por ordem de certificação.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={handlePayment}
                    size="lg"
                    className="w-full bg-[#002c5f] hover:bg-[#00234c] text-white font-medium py-3 text-base shadow-lg"
                  >
                    Realizar Certificação - R$ 19,90
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Pagamento seguro • Acesso imediato após confirmação</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons - Melhorados para Mobile */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center justify-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto order-2 sm:order-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 &&
                      (!formData.nome ||
                        !formData.email ||
                        !emailValid ||
                        !formData.telefone ||
                        !formData.cidade ||
                        !formData.estado)) ||
                    (currentStep === 2 &&
                      (!requisitos.ensinoMedio ||
                        !requisitos.informaticaBasica ||
                        !requisitos.boaComunicacao ||
                        !requisitos.disponibilidadeHorario ||
                        !formData.aceiteTermos)) ||
                    isSaving
                  }
                  className="flex items-center justify-center space-x-2 bg-[#002c5f] hover:bg-[#00234c] text-white w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <span>{getButtonText()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer - Compacto */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-gray-500">© 2024 EmpregaJá - Todos os direitos reservados</p>
          <p className="text-xs text-gray-400 mt-1">contato@empregaja.com.br | (11) 3500-8000</p>
        </div>
      </div>
    </div>
  )
}
