"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
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
  Calendar,
} from "lucide-react"

export default function ProcessoSeletivo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [processId] = useState(`PS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
  const [userLocation, setUserLocation] = useState<string>("")
  const [vagasRestantes, setVagasRestantes] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
    aceiteTermos: false,
  })

  const [requisitos, setRequisitos] = useState({
    ensinoMedio: false,
    informaticaBasica: false,
    boaComunicacao: false,
    disponibilidadeHorario: false,
  })

  const steps = ["Informações da Vaga", "Dados Pessoais", "Requisitos", "Certificação"]

  const progress = ((currentStep + 1) / steps.length) * 100

  // Detectar localização do usuário
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Primeiro tenta usar a API de geolocalização do navegador
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Usar reverse geocoding para obter cidade/estado
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=pt`,
                )
                const data = await response.json()
                // Simplificar para mostrar apenas a cidade principal
                const cidade = data.city || data.locality || "sua região"
                setUserLocation(cidade)
                setVagasRestantes(Math.floor(Math.random() * 8) + 3) // 3-10 vagas
              } catch (error) {
                setUserLocation("sua região")
                setVagasRestantes(Math.floor(Math.random() * 8) + 3)
              }
            },
            () => {
              // Se o usuário negar a localização, usar IP
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
        // Simplificar para mostrar apenas a cidade principal
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
        return "Iniciar Processo Seletivo"
      case 1:
        return "Prosseguir com Candidatura"
      case 2:
        return "Validar Requisitos"
      default:
        return "Continuar"
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTelefoneChange = (value: string) => {
    // Permitir apenas números, parênteses, espaços e hífens
    const cleanValue = value.replace(/[^\d\s\-$$$$]/g, "")
    setFormData((prev) => ({ ...prev, telefone: cleanValue }))
  }

  const handleRequisitoChange = (field: string, checked: boolean) => {
    setRequisitos((prev) => ({ ...prev, [field]: checked }))
  }

  const saveToLocalStorage = (data: any) => {
    try {
      // Obter dados existentes
      const existingData = localStorage.getItem("candidatos") || "[]"
      const candidatos = JSON.parse(existingData)

      // Adicionar novo candidato
      candidatos.push(data)

      // Salvar de volta
      localStorage.setItem("candidatos", JSON.stringify(candidatos))

      console.log("Dados salvos com sucesso:", data)
      return { success: true }
    } catch (error) {
      console.error("Erro ao salvar dados:", error)
      return { success: false, error: String(error) }
    }
  }

  const nextStep = async () => {
    // Se estamos na etapa de dados pessoais e vamos avançar, salvar os dados
    if (currentStep === 1) {
      setIsSaving(true)
      try {
        // Formatar data e hora atual
        const now = new Date()
        const dataHora = now.toLocaleString("pt-BR")

        // Salvar dados no localStorage
        const dadosParaSalvar = {
          processId,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cidade: formData.cidade,
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
    // Aqui você pode redirecionar para seu link de pagamento
    window.open("https://seu-link-de-pagamento.com", "_blank")
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-[#002c5f] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">EmpregaJá</h1>
              <div className="bg-[#002c5f] border-2 border-white rounded-full p-1 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <Badge className="bg-[#002c5f] text-white border border-white ml-2">Verificado</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Vagas por Região - Fixo no topo - Cor mais suave */}
      {currentStep === 0 && userLocation && (
        <div className="bg-[#002c5f] bg-opacity-90 text-white py-3 shadow-md">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-2 text-center">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">
                {vagasRestantes} vagas disponíveis em {userLocation}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-[#002c5f]">
              Etapa {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="flex justify-between mt-3">
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
          <CardContent className="p-8">
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-4 bg-[#002c5f] text-white border-[#002c5f]">
                    Home Office
                  </Badge>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Atendente de Home Office</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    O emprego que você procura está aqui! Oportunidade para profissionais que buscam trabalhar
                    remotamente em uma empresa consolidada no mercado brasileiro.
                  </p>

                  {/* Destaque da região - Mais sutil */}
                  {userLocation && (
                    <div className="mt-6 p-4 bg-[#f0f4f8] border border-[#d1dce5] rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <MapPin className="w-5 h-5 text-[#002c5f]" />
                        <span className="font-semibold text-[#002c5f]">Vagas disponíveis para {userLocation}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Encontramos {vagasRestantes} vagas abertas na sua região
                      </p>
                    </div>
                  )}
                </div>

                {/* Seção Sobre a Empresa */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building2 className="w-6 h-6 text-[#002c5f]" />
                    <h3 className="text-xl font-semibold text-gray-900">Sobre a Conecta Soluções</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 mb-4">
                        A Conecta Soluções é uma empresa líder no setor de atendimento ao cliente, com mais de 15 anos
                        de experiência no mercado brasileiro. Oferecemos soluções completas em contact center e
                        atendimento digital.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">Mais de 2.000 colaboradores</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-[#002c5f]" />
                          <span className="text-sm text-gray-600">Fundada em 2009</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[#002c5f]" />
                          <span className="text-sm text-gray-600">Presente em todo o Brasil</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Nossos Diferenciais:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Ambiente de trabalho colaborativo</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Treinamentos constantes</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Plano de carreira estruturado</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Tecnologia de ponta</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border shadow-sm">
                    <DollarSign className="w-5 h-5 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900">Remuneração</p>
                      <p className="text-sm text-gray-600">R$ 1.800,00 a R$ 2.200,00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border shadow-sm">
                    <Clock className="w-5 h-5 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900">Jornada</p>
                      <p className="text-sm text-gray-600">44h semanais</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border shadow-sm">
                    <MapPin className="w-5 h-5 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900">Modalidade</p>
                      <p className="text-sm text-gray-600">100% Remoto</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border shadow-sm">
                    <Users className="w-5 h-5 text-[#002c5f]" />
                    <div>
                      <p className="font-medium text-gray-900">Vagas Disponíveis</p>
                      <p className="text-sm text-gray-600">
                        {userLocation ? `${vagasRestantes} em ${userLocation}` : "20 posições"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Principais Responsabilidades</h3>
                    <ul className="space-y-3">
                      {[
                        "Atendimento ao cliente via telefone e chat online",
                        "Registro e acompanhamento de solicitações no sistema",
                        "Esclarecimento de dúvidas sobre produtos e serviços",
                        "Suporte técnico básico aos usuários",
                        "Cumprimento de metas de atendimento estabelecidas",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-[#002c5f] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#f0f4f8] border border-[#d1dce5] rounded-lg p-6">
                    <h3 className="text-lg font-medium text-[#002c5f] mb-4">Benefícios Oferecidos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                        <span className="text-sm text-[#002c5f]">Vale alimentação</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                        <span className="text-sm text-[#002c5f]">Plano de saúde</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                        <span className="text-sm text-[#002c5f]">Auxílio internet</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                        <span className="text-sm text-[#002c5f]">Plano de carreira</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Dados Pessoais</h2>
                  <p className="text-gray-600">Preencha suas informações básicas para prosseguir</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f]"
                    />
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
                    />
                    <p className="text-xs text-gray-500">Digite apenas números</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
                      Cidade/Estado *
                    </Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      placeholder="Digite sua cidade e estado"
                      className="border-gray-300 focus:border-[#002c5f] focus:ring-[#002c5f]"
                    />
                  </div>
                </div>

                <div className="bg-[#f0f4f8] border border-[#d1dce5] rounded-lg p-4">
                  <p className="text-sm text-[#002c5f]">
                    <strong>Informação:</strong> Após a aprovação, entraremos em contato via WhatsApp para agendar uma
                    breve entrevista online.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Requisitos da Vaga</h2>
                  <p className="text-gray-600">Verifique se você atende aos requisitos necessários para a posição</p>
                </div>

                <div className="space-y-6">
                  <Card className="border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900">Requisitos Obrigatórios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <Checkbox
                            id="ensinoMedio"
                            checked={requisitos.ensinoMedio}
                            onCheckedChange={(checked) => handleRequisitoChange("ensinoMedio", checked as boolean)}
                            className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f]"
                          />
                          <Label htmlFor="ensinoMedio" className="text-gray-700">
                            Ensino médio completo
                          </Label>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Checkbox
                            id="informaticaBasica"
                            checked={requisitos.informaticaBasica}
                            onCheckedChange={(checked) =>
                              handleRequisitoChange("informaticaBasica", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f]"
                          />
                          <Label htmlFor="informaticaBasica" className="text-gray-700">
                            Conhecimentos básicos de informática
                          </Label>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Checkbox
                            id="boaComunicacao"
                            checked={requisitos.boaComunicacao}
                            onCheckedChange={(checked) => handleRequisitoChange("boaComunicacao", checked as boolean)}
                            className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f]"
                          />
                          <Label htmlFor="boaComunicacao" className="text-gray-700">
                            Boa comunicação verbal e escrita
                          </Label>
                        </li>
                        <li className="flex items-center space-x-3">
                          <Checkbox
                            id="disponibilidadeHorario"
                            checked={requisitos.disponibilidadeHorario}
                            onCheckedChange={(checked) =>
                              handleRequisitoChange("disponibilidadeHorario", checked as boolean)
                            }
                            className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f]"
                          />
                          <Label htmlFor="disponibilidadeHorario" className="text-gray-700">
                            Disponibilidade para horário comercial
                          </Label>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-gray-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-900">Requisitos Técnicos para Home Office</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Monitor className="w-5 h-5 text-[#002c5f]" />
                          <div>
                            <p className="font-medium text-gray-900">Computador</p>
                            <p className="text-sm text-gray-600">Windows 10+ ou equivalente</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Wifi className="w-5 h-5 text-[#002c5f]" />
                          <div>
                            <p className="font-medium text-gray-900">Internet</p>
                            <p className="text-sm text-gray-600">Conexão estável mínima 10MB</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Headphones className="w-5 h-5 text-[#002c5f]" />
                          <div>
                            <p className="font-medium text-gray-900">Headset</p>
                            <p className="text-sm text-gray-600">Para atendimento telefônico</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-[#002c5f]" />
                          <div>
                            <p className="font-medium text-gray-900">Ambiente</p>
                            <p className="text-sm text-gray-600">Local silencioso para trabalho</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Checkbox de confirmação movido para cá e destacado */}
                  <Card className="border-[#002c5f] border-2 bg-[#f8fafc]">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id="termos"
                          checked={formData.aceiteTermos}
                          onCheckedChange={(checked) => handleInputChange("aceiteTermos", checked as boolean)}
                          className="data-[state=checked]:bg-[#002c5f] data-[state=checked]:border-[#002c5f] mt-1"
                        />
                        <div>
                          <Label htmlFor="termos" className="text-base font-medium text-[#002c5f] cursor-pointer">
                            Confirmo que atendo a todos os requisitos listados acima *
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Esta confirmação é obrigatória para prosseguir com o processo seletivo
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-800 text-sm font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Informação Importante</h4>
                        <p className="text-sm text-amber-700">
                          Todos os candidatos aprovados deverão realizar uma certificação profissional obrigatória antes
                          do início das atividades, conforme política da empresa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#002c5f] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Candidatura Aprovada</h2>
                  <p className="text-gray-600">Você atende aos requisitos para a vaga de Atendente de Home Office</p>
                </div>

                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Certificação Profissional Obrigatória</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">
                      Para garantir a padronização e qualidade do atendimento, todos os colaboradores devem realizar
                      nossa certificação profissional antes do início das atividades.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h4 className="font-medium text-gray-900 mb-3">Conteúdo da Certificação:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Módulo de atendimento ao cliente</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Treinamento nos sistemas da empresa</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Técnicas de comunicação profissional</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-[#002c5f]" />
                          <span>Certificado digital de conclusão</span>
                        </li>
                      </ul>
                    </div>

                    {/* Destaque maior para o valor da certificação */}
                    <div className="bg-[#002c5f] text-white rounded-lg p-6 shadow-md">
                      <h4 className="font-semibold text-xl mb-3 text-center">Investimento na Certificação</h4>
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold mb-4">R$ 19,90</div>
                        <p className="text-center mb-4">
                          Este valor é necessário para iniciar o processo de certificação profissional obrigatória.
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                        <p className="font-medium mb-2 text-center">O que está incluído:</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                            <span>Acesso à plataforma de treinamento</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                            <span>Materiais didáticos completos</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                            <span>Suporte técnico durante o curso</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                            <span>Emissão do certificado digital</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800 mb-1">Importante:</h4>
                          <p className="text-sm text-amber-700">
                            A certificação deve ser concluída em até 7 dias após o pagamento. As vagas são preenchidas
                            conforme a ordem de certificação dos candidatos.
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
                    className="w-full md:w-auto bg-[#002c5f] hover:bg-[#00234c] text-white font-medium py-4 px-8 text-lg shadow-lg"
                  >
                    Realizar Certificação - R$ 19,90
                  </Button>
                  <p className="text-sm text-gray-500 mt-3">
                    Pagamento seguro • Acesso imediato ao curso após confirmação
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>

              {currentStep < steps.length - 1 && (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 &&
                      (!formData.nome || !formData.email || !formData.telefone || !formData.cidade)) ||
                    (currentStep === 2 &&
                      (!requisitos.ensinoMedio ||
                        !requisitos.informaticaBasica ||
                        !requisitos.boaComunicacao ||
                        !requisitos.disponibilidadeHorario ||
                        !formData.aceiteTermos)) ||
                    isSaving
                  }
                  className="flex items-center space-x-2 bg-[#002c5f] hover:bg-[#00234c] text-white"
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

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">© 2024 EmpregaJá - Todos os direitos reservados</p>
          <p className="text-xs text-gray-400 mt-1">
            Dúvidas sobre o processo seletivo: contato@empregaja.com.br | (11) 3500-8000
          </p>
        </div>
      </div>
    </div>
  )
}
