import React, { useState } from "react"
import { supabase } from "../supabaseClient"

export default function MovimentacaoModal({ aberto, setAberto, materiais, atualizar }) {
  const [materialId, setMaterialId] = useState("")
  const [tipo, setTipo] = useState("entrada")
  const [quantidade, setQuantidade] = useState(0)

  const registrar = async () => {
    if (!materialId || quantidade <= 0) return

    const materialSelecionado = materiais.find((m) => m.id === materialId)
    if (!materialSelecionado) return

    const novaQuantidade =
      tipo === "entrada"
        ? materialSelecionado.quantidade + quantidade
        : materialSelecionado.quantidade - quantidade

    if (novaQuantidade < 0) {
      alert("Quantidade insuficiente para saída.")
      return
    }

    // Atualiza a quantidade no estoque
    const { error: error1 } = await supabase
      .from("materiais")
      .update({ quantidade: novaQuantidade })
      .eq("id", materialSelecionado.id)

    // Registra movimentação (corrigido: usar material_id)
    const { error: error2 } = await supabase.from("movimentacoes").insert([
      {
        tipo,
        quantidade,
        material_id: materialSelecionado.id, //
      },
    ])

    if (!error1 && !error2) {
      setAberto(false)
      setMaterialId("")
      setQuantidade(0)
      setTipo("entrada")
      atualizar()
    } else {
      console.error("Erro ao registrar movimentação:", error1 || error2)
    }
  }

  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">🔄 Registrar Movimentação</h2>

        <select
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="">Selecione um material</option>
          {materiais.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>

        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="border p-2 rounded w-full mb-4"
          placeholder="Quantidade"
        />

        <div className="flex justify-between">
          <button
            onClick={registrar}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Registrar
          </button>
          <button
            onClick={() => setAberto(false)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}