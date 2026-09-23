import { useEffect, useMemo, useState } from 'react'

import { api } from '../api/client.js'

// รองรับ FR-BKG-01, FR-BKG-06
export default function SlotPicker() {
  const packageOptions = useMemo(
    () => [
      { value: 'basic', label: 'แพ็กเกจพื้นฐาน' },
      { value: 'premium', label: 'แพ็กเกจพรีเมียม' },
    ],
    [],
  )

  const [packageCode, setPackageCode] = useState(packageOptions[0].value)
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10))
  const [slots, setSlots] = useState([])
  const [selectedSlotId, setSelectedSlotId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSlots() {
      setLoading(true)
      setError('')
      try {
        const data = await api.getSlots({ dateFrom, packageCode })
        const list = Array.isArray(data) ? data : data.slots ?? []
        if (isMounted) {
          setSlots(list)
          setSelectedSlotId(list[0]?.id ?? '')
        }
      } catch (err) {
        if (isMounted) {
          setError('ไม่สามารถโหลดช่วงเวลาว่างได้')
          setSlots([])
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSlots()
    return () => {
      isMounted = false
    }
  }, [dateFrom, packageCode])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">เลือกแพ็กเกจ</p>
          <select
            aria-label="เลือกแพ็กเกจ"
            value={packageCode}
            onChange={(event) => setPackageCode(event.target.value)}
            className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800"
          >
            {packageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">วันที่</p>
          <input
            aria-label="เลือกวันที่"
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="mt-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-semibold text-slate-700">ช่วงเวลาและจำนวนที่นั่งคงเหลือ</p>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">กำลังโหลดช่วงเวลา...</p>
        ) : error ? (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        ) : slots.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">ไม่พบช่วงเวลาว่างสำหรับแพ็กเกจนี้</p>
        ) : (
          <div className="mt-3 grid gap-3">
            {slots.map((slot) => {
              const isSelected = selectedSlotId === slot.id
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50 text-teal-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50/50'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{slot.start_time ?? slot.startTime ?? 'เวลา'}</div>
                    <div className="text-xs text-slate-500">{slot.slot_date ?? slot.date ?? 'วัน'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">คงเหลือ</div>
                    <div className="text-lg font-bold">{slot.remaining ?? 0}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
        <span className="font-semibold">ช่วงเวลาที่เลือก:</span>{' '}
        {selectedSlotId ? `#${selectedSlotId}` : 'ยังไม่ได้เลือก'}
      </div>
    </section>
  )
}
