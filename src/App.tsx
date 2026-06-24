import { useRef, useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, ArrowRight, Copy, RotateCcw } from 'lucide-react'
import { toBlob } from 'html-to-image'

const CASHIERS = [
  'John Doe',
  'Jane Smith',
  'Alex Morgan',
  'Maria Garcia',
  'David Chen',
  'Sarah Johnson',
  'Michael Brown',
  'Emma Wilson',
  'James Miller',
]

interface FormState {
  name: string
  purpose: string
  amount: string
}

export default function App() {
  const [form, setForm] = useState<FormState>({ name: '', purpose: '', amount: '' })
  const [issued, setIssued] = useState(false)
  const [ticketNo, setTicketNo] = useState('')
  const [date, setDate] = useState('')
  const [cashier, setCashier] = useState('')
  const ticketRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [copying, setCopying] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.purpose || !form.amount) return
    setTicketNo(Math.random().toString(36).substring(2, 10).toUpperCase())
    setCashier(CASHIERS[Math.floor(Math.random() * CASHIERS.length)])
    setDate(
      new Date()
        .toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(',', ''),
    )
    setIssued(true)
  }

  const handleReset = () => {
    setIssued(false)
    setForm({ name: '', purpose: '', amount: '' })
  }

  const handleCopy = async () => {
    if (!ticketRef.current) return
    setCopying(true)
    try {
      const blob = await toBlob(ticketRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        style: { transform: 'none' },
      })
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setToast('Receipt copied to clipboard!')
        setTimeout(() => setToast(null), 3000)
      }
    } catch (err) {
      console.error('Failed to copy image', err)
      setToast('Failed to copy. Please try again.')
      setTimeout(() => setToast(null), 3000)
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f0f0f0] font-mono flex flex-col items-center justify-center p-4 py-12 overflow-x-hidden overflow-y-auto selection:bg-neutral-300 selection:text-black text-neutral-900">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 max-w-[90vw] bg-white border border-neutral-200 text-neutral-900 px-4 py-2.5 text-xs font-medium shadow-sm flex items-center gap-2 rounded-full"
          >
            <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[340px] w-full flex flex-col items-center">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-neutral-900 mb-1.5">
            <Ticket className="w-5 h-5 stroke-[2]" />
            <h1 className="text-lg font-bold tracking-wide font-sans leading-none mt-0.5">Receiper</h1>
          </div>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-medium">Receipt Generator</p>
        </div>

        <div className="w-full relative flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {issued ? (
              <motion.div key="receipt-view" className="w-full flex flex-col items-center">
                <div className="w-[80%] h-[3px] bg-neutral-200/50 rounded-full mb-[-1.5px] z-20 relative" />
                <div className="w-full overflow-hidden flex flex-col items-center z-10 px-0 relative">
                  <motion.div
                    initial={{ y: '-100%' }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 60, duration: 0.8 }}
                    className="w-full"
                  >
                    <div
                      ref={ticketRef}
                      className="w-full bg-white text-neutral-900 p-8 border border-neutral-100 shadow-sm rounded-xl"
                    >
                      <div className="text-center pb-5 border-b border-neutral-200">
                        <div className="flex justify-center mb-2">
                          <Ticket className="w-5 h-5 stroke-[2] text-neutral-600" />
                        </div>
                        <h2 className="text-base font-bold tracking-widest font-sans uppercase text-neutral-900">
                          Receipt
                        </h2>
                        <p className="text-[9px] uppercase mt-1 text-neutral-500 tracking-wider font-semibold">
                          Thank You For Your Purchase
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 text-[9px] py-4 border-b border-neutral-200 uppercase tracking-widest text-neutral-500 font-semibold">
                        <span>Receipt No:</span>
                        <span className="text-right text-neutral-900">{ticketNo}</span>
                        <span>Date:</span>
                        <span className="text-right text-neutral-900">{date}</span>
                        <span>Cashier:</span>
                        <span className="text-right text-neutral-900">{cashier}</span>
                      </div>

                      <div className="py-6 flex flex-col gap-5">
                        <div>
                          <div className="text-neutral-500 text-[9px] mb-1.5 uppercase tracking-widest font-semibold">
                            Title:
                          </div>
                          <div className="text-sm uppercase break-all font-bold text-neutral-900 font-sans">
                            {form.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-[9px] mb-1.5 uppercase tracking-widest font-semibold">
                            Description:
                          </div>
                          <div className="text-[12px] uppercase break-words leading-relaxed tracking-wide text-neutral-900 font-bold font-sans">
                            {form.purpose}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end py-4 border-t border-neutral-200">
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
                          Total
                        </span>
                        <span className="text-xl tracking-tight font-bold text-neutral-900">
                          ${parseFloat(form.amount).toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full flex justify-center mt-4 opacity-40 h-4">
                        {Array.from({ length: 32 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: `${Math.max(1, Math.random() * 3)}px`,
                              height: '100%',
                              backgroundColor: '#171717',
                              marginRight: `${Math.random() * 2}px`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="mt-8 pt-4 border-t border-neutral-200 flex justify-center items-center text-[8px] text-neutral-500 font-sans uppercase tracking-[0.15em] font-bold">
                        <span>Receiper · Thank You</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 flex w-full gap-3"
                >
                  <button
                    onClick={handleCopy}
                    disabled={copying}
                    className="flex-1 bg-neutral-900 text-white p-3 rounded-full uppercase text-[9px] flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-50 tracking-widest"
                  >
                    <Copy className="w-3.5 h-3.5 stroke-[1.5]" />
                    {copying ? '...' : 'Copy Image'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-transparent border border-neutral-200 text-neutral-600 p-3 rounded-full uppercase text-[9px] flex items-center justify-center gap-1.5 hover:bg-neutral-100 transition-colors tracking-widest"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[1.5]" />
                    Reset
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                onSubmit={handleSubmit}
                className="w-full bg-white border border-neutral-100 p-6 sm:p-8 flex flex-col gap-6 rounded-2xl shadow-sm"
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="uppercase text-[9px] tracking-widest text-neutral-500 font-semibold mb-0.5"
                  >
                    Title
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g., One Large Coffee"
                    className="border-b border-neutral-200 focus:border-neutral-500 py-2 outline-none transition-colors text-sm bg-transparent placeholder:text-neutral-400 font-medium font-sans"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="purpose"
                    className="uppercase text-[9px] tracking-widest text-neutral-500 font-semibold mb-0.5"
                  >
                    Description
                  </label>
                  <textarea
                    id="purpose"
                    required
                    placeholder="e.g., Oat milk, extra shot, no sugar"
                    className="border-b border-neutral-200 focus:border-neutral-500 py-2 outline-none transition-colors text-sm bg-transparent h-14 resize-none placeholder:text-neutral-400 font-medium overflow-hidden font-sans"
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="amount"
                    className="uppercase text-[9px] tracking-widest text-neutral-500 font-semibold mb-0.5"
                  >
                    Amount ($)
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    className="border-b border-neutral-200 focus:border-neutral-500 py-2 outline-none transition-colors text-sm bg-transparent placeholder:text-neutral-400 font-medium font-sans"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full bg-neutral-900 text-white p-3.5 rounded-full uppercase text-[10px] tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  Generate Receipt
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
