import { useEffect, useRef, useState } from 'react'

export const META_XP = 600

const MARCOS = [
  { xp: 0, nome: 'Vila' },
  { xp: 150, nome: 'Ponte' },
  { xp: 300, nome: 'Mata' },
  { xp: 450, nome: 'Serra' },
  { xp: 600, nome: 'Castelo' }
]

export default function Trilha({ xp }) {
  const [andando, setAndando] = useState(false)
  const primeira = useRef(true)

  // Quando o XP muda, o aventureiro "anda" por pouco mais de um segundo.
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false
      return
    }
    setAndando(true)
    const parar = setTimeout(() => setAndando(false), 1150)
    return () => clearTimeout(parar)
  }, [xp])

  const posicao = Math.min(xp / META_XP, 1) * 100

  return (
    <div className="cena" role="img" aria-label={`Aventureiro com ${xp} de ${META_XP} XP na trilha`}>
      <svg className="colinas" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120 L0 70 L60 40 L120 66 L190 28 L260 64 L330 36 L400 70 L470 34 L540 62 L600 44 L600 120 Z" fill="var(--colina-longe)" />
        <path d="M0 120 L0 92 L80 70 L160 94 L250 66 L340 96 L430 72 L520 98 L600 76 L600 120 Z" fill="var(--colina-perto)" />
      </svg>
      <div className="chao" />

      <div className="trilha">
        {MARCOS.map((m) => (
          <div
            key={m.nome}
            className={`marco ${xp >= m.xp ? 'alcancado' : ''}`}
            style={{ left: `${(m.xp / META_XP) * 100}%` }}
          >
            <div className="poste" />
            <div className="bandeira" />
            <div className="nome-marco">
              {m.nome}
              <small>{m.xp} XP</small>
            </div>
          </div>
        ))}

        <div className={`heroi ${andando ? 'andando' : ''}`} style={{ left: `${posicao}%` }}>
          <svg viewBox="0 0 12 16" aria-hidden="true">
            <rect x="9" y="6" width="2" height="5" fill="var(--mochila)" />
            <rect x="3" y="0" width="6" height="2" fill="var(--chapeu)" />
            <rect x="2" y="2" width="8" height="1" fill="var(--chapeu)" />
            <rect x="3" y="3" width="6" height="3" fill="var(--pele)" />
            <rect x="4" y="4" width="1" height="1" fill="var(--tinta)" />
            <rect x="7" y="4" width="1" height="1" fill="var(--tinta)" />
            <rect x="3" y="6" width="6" height="5" fill="var(--tunica)" />
            <rect x="2" y="7" width="1" height="3" fill="var(--pele)" />
            <rect x="9" y="7" width="1" height="3" fill="var(--pele)" />
            <g className="perna-a" fill="var(--tinta)">
              <rect x="3" y="11" width="2" height="4" />
              <rect x="7" y="11" width="2" height="3" />
            </g>
            <g className="perna-b" fill="var(--tinta)">
              <rect x="3" y="11" width="2" height="3" />
              <rect x="7" y="11" width="2" height="4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
