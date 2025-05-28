"use server"
import path from "path"
import { promises as fsPromises } from "fs"

type FormData = {
  nome: string
  email: string
  telefone: string
  cidade: string
  dataHora: string
  userLocation?: string
}

export async function saveToCSV(data: FormData) {
  try {
    // Definir o caminho do arquivo CSV
    const filePath = path.join(process.cwd(), "candidatos.csv")

    // Verificar se o arquivo existe
    let fileExists = false
    try {
      await fsPromises.access(filePath)
      fileExists = true
    } catch (error) {
      // Arquivo não existe
    }

    // Criar cabeçalho se o arquivo não existir
    if (!fileExists) {
      const header = "Nome,Email,Telefone,Cidade,Data/Hora,Localização Detectada\n"
      await fsPromises.writeFile(filePath, header)
    }

    // Formatar os dados para CSV
    const csvLine = `"${data.nome}","${data.email}","${data.telefone}","${data.cidade}","${data.dataHora}","${data.userLocation || ""}"\n`

    // Adicionar ao arquivo
    await fsPromises.appendFile(filePath, csvLine)

    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar dados:", error)
    return { success: false, error: String(error) }
  }
}
