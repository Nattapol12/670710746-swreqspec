import SlotPicker from './pages/SlotPicker.jsx'

// โครงเริ่มต้นของรายวิชา: หน้าจอของ task จะถูกเชื่อมเข้ามาทีละหน้า
export default function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
        <p className="mt-2 text-slate-600">เลือกแพ็กเกจและช่วงเวลาที่ต้องการจองคิว</p>
      </header>
      <SlotPicker />
    </main>
  )
}
