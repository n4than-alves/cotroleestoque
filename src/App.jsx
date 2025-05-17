import React, { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import MovimentacaoModal from "./components/MovimentacaoModal"

export default function App() {
  const [materiais, setMateriais] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [modalAberto, setModalAberto] = useState(false)

  const [novoMaterial, setNovoMaterial] = useState("")
  const [quantidade, setQuantidade] = useState(0)
  const [estoqueMin, setEstoqueMin] = useState(0)
  const [estoqueMax, setEstoqueMax] = useState(0)

  const carregarMateriais = async () => {
    const { data, error } = await supabase.from("materiais").select("*")
    if (error) console.error("Erro ao carregar materiais:", error)
    setMateriais(data || [])
  }

  const carregarMovimentacoes = async () => {
    const { data, error } = await supabase
      .from("movimentacoes")
      .select("id, tipo, quantidade, criado_em, materiais (nome)")
      .order("criado_em", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Erro ao carregar movimentações:", error)
      return
    }

    setMovimentacoes(data || [])
  }

  useEffect(() => {
    carregarMateriais()
    carregarMovimentacoes()
  }, [])

  const adicionarMaterial = async () => {
    if (!novoMaterial || quantidade <= 0) return

    const { error } = await supabase.from("materiais").insert([
      {
        nome: novoMaterial,
        quantidade,
        estoque_minimo: estoqueMin,
        estoque_maximo: estoqueMax,
      },
    ])
    if (!error) {
      setNovoMaterial("")
      setQuantidade(0)
      setEstoqueMin(0)
      setEstoqueMax(0)
      carregarMateriais()
    } else {
      console.error("Erro ao adicionar material:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📦 Controle de Estoque</h1>

        {/* Formulário de novo material */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">➕ Adicionar Material</h2>
          <input
            type="text"
            placeholder="Nome do material"
            
            onChange={(e) => setNovoMaterial(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Quantidade"
            
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Estoque Mínimo"
            
            onChange={(e) => setEstoqueMin(Number(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Estoque Máximo"
            
            onChange={(e) => setEstoqueMax(Number(e.target.value))}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={adicionarMaterial}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-2"
          >
            ➕ Adicionar
          </button>
          <button
            onClick={() => setModalAberto(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
          >
            🔄 Registrar Movimentação
          </button>
        </div>

        {/* Lista de materiais */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Materiais em Estoque</h2>
          {materiais.length === 0 ? (
            <p className="text-gray-500">Nenhum material encontrado.</p>
          ) : (
            <ul className="space-y-2">
              {materiais.map((item) => {
                const estoqueBaixo = item.quantidade < item.estoque_minimo
                return (
                  <li
                    key={item.id}
                    className={`flex justify-between items-center border p-2 rounded ${
                      estoqueBaixo ? "bg-red-100" : ""
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{item.nome}</span>{" "}
                      <span className="text-sm text-gray-600">
                        (Min: {item.estoque_minimo} | Max: {item.estoque_maximo})
                      </span>
                    </div>
                    <span className="font-bold">
                      {item.quantidade}
                      {estoqueBaixo && (
                        <span className="ml-2 text-red-600 text-sm font-semibold">
                          ⚠️ Baixo Estoque
                        </span>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Últimas movimentações */}
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">📊 Últimas Movimentações</h2>
          {movimentacoes.length === 0 ? (
            <p className="text-gray-500">Nenhuma movimentação registrada.</p>
          ) : (
            <ul className="space-y-2">
              {movimentacoes.map((m) => (
                <li key={m.id} className="border p-2 rounded text-sm">
                  <strong>{m.tipo.toUpperCase()}</strong> - {m.materiais?.nome} (
                  {m.quantidade} unidades) em{" "}
                  {new Date(m.criado_em).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modal de movimentação */}
        <MovimentacaoModal
          aberto={modalAberto}
          setAberto={setModalAberto}
          materiais={materiais}
          atualizar={() => {
            carregarMateriais()
            carregarMovimentacoes()
          }}
        />
      </div>
    </div>
  )
}
