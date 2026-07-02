"use client"

import { useEffect, useRef, useState } from "react"

type Msg = { role: "user" | "assistant"; content: string }

const GREETING: Msg = {
  role: "assistant",
  content: "Szia! 🍵 A Momo Matcha asszisztense vagyok. Kérdezz bátran matcháról, ízekről, szállításról vagy visszaküldésről!",
}

const ChatWidget = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const next: Msg[] = [...messages, { role: "user", content: text }]
    setMessages(next)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: "assistant", content: data.reply || "…" }])
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "Hiba történt. Írj nekünk: info@momomatcha.hu" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ügyfélszolgálati chat"
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-matcha-accent text-white text-2xl shadow-xl shadow-matcha-accent/30 flex items-center justify-center hover:-translate-y-0.5 transition-transform"
      >
        {open ? "✕" : "🍵"}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-[60] w-[92vw] max-w-[370px] h-[520px] max-h-[70vh] flex flex-col rounded-large overflow-hidden bg-matcha-cream border border-matcha-kraft shadow-2xl">
          <div className="px-5 py-4 bg-matcha-dark text-matcha-cream">
            <p className="font-heading font-bold text-lg leading-none">Momo Matcha</p>
            <p className="text-xs text-matcha-cream/70 mt-1">Kérdezz bátran — általában azonnal válaszolok 🍵</p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "self-end bg-matcha-accent text-white rounded-br-sm"
                    : "self-start bg-white text-matcha-text border border-matcha-kraft/60 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-white text-matcha-text/50 border border-matcha-kraft/60 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm">
                Gépel…
              </div>
            )}
          </div>

          <div className="p-3 border-t border-matcha-kraft/60 bg-matcha-cream">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={1}
                placeholder="Írd ide a kérdésed…"
                className="flex-1 resize-none rounded-2xl border border-matcha-kraft bg-white px-3.5 py-2.5 text-sm text-matcha-text focus:outline-none focus:border-matcha-accent max-h-24"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="shrink-0 h-10 px-4 rounded-full bg-matcha-accent text-white font-bold text-sm disabled:opacity-40 hover:-translate-y-0.5 transition-transform"
              >
                Küldés
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatWidget
