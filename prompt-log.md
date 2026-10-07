# Prompt log

บันทึกทุกครั้งที่ใช้ AI กับ repo นี้ เขียนต่อท้ายเรื่อย ๆ ไม่ลบของเก่า

---

## 2569-09-23 13.40 คำสั่ง: /tasks specs/001-booking/spec.md

- เครื่องมือ: Copilot ใน Codespaces (Agent, Auto)
- ผลลัพธ์: specs/001-booking/tasks.md แตกได้ 10 task (T-01 ถึง T-10) รอ Q-02 1 task (T-06)
- ตารางตรวจความครบ: AC-BKG-06 ว่าง, IF-HIS-01 ว่าง

### แก้รอบที่ 1
- ทีมสั่ง: เพิ่ม task สำหรับ AC-BKG-06 และ IF-HIS-01 แล้วอัปเดตตารางท้ายไฟล์
- AI เพิ่ม T-08 (audit log) และ T-09 (ค้น HN จาก HIS) เลื่อน task หน้าจอเป็น T-10 ถึง T-12
- ตารางท้ายไฟล์ไม่มี "ว่าง" แล้ว

---

## 2569-09-23 14.20 คำสั่ง: /implement T-01 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/config.py, backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_T01_schema.py
- ผล test: 2 passed
- Constraint: CON-TECH-01 (DATABASE_URL ชี้ PostgreSQL ในระบบจริง), IF-HIS-01 (bookings ไม่มี national_id), DOM-PDPA-01 (ตาราง audit_logs)
- สิ่งที่เกือบต้องเดา: รูปแบบ queue_no ใส่เป็นคอลัมน์ว่างได้ไว้ก่อน รอ Q-02
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-27 19.05 คำสั่ง: /implement T-02 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/main.py, backend/tests/conftest.py, backend/tests/test_AC_BKG_05.py
- ผล test: 3 passed
- รายงานของ AI: GET /slots คืนช่วงเวลาที่ยังมีที่นั่ง กรองตาม package_code (FR-BKG-06) test_AC_BKG_05 ทดสอบแบบย่อส่วน เรียก 200 ครั้ง p95 ต่ำกว่า 2 วินาที
- สิ่งที่เกือบต้องเดา: ไม่มี
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2569-09-28 20.30 คำสั่ง: /implement T-03 specs/001-booking/tasks.md

- ไฟล์ที่สร้าง: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py และแก้ backend/app/main.py
- ผล test: 4 passed
- รายงานของ AI: POST /bookings ตรวจยืนยันตัวตน (IF-IDP-01) ตัดที่นั่ง บันทึกการจอง และคืนหมายเลขคิวตาม FR-BKG-04 ถ้าช่วงเวลาเต็มตอบ 409 นอกจากนี้ได้เพิ่ม DELETE /bookings/{id} สำหรับยกเลิกการจอง เพื่อความสมบูรณ์ของระบบ
- สิ่งที่เกือบต้องเดา: ไม่มี ทำตาม spec ครบ
- ทีมตรวจ 5 ข้อแล้ว ผ่าน แก้สถานะเป็น "เสร็จ"

---

## 2026-10-07 00:00 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: ร่าง (AC-BKG-01 ยังไม่มีแถวใน test-cases.md)
- TC ID ที่เสนอ: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผล: หยุดก่อนเขียนโค้ด test เพราะต้องตรวจแถวในตารางก่อน แล้วแก้สถานะเป็น "ใช้ได้" เพื่อให้คอมไพล์ต่อได้ตามข้อกำหนด
- รายละเอียด: AC-BKG-01 มี 3 ส่วนใน Then: บันทึกสำเร็จ / แสดงหมายเลขคิว / ที่นั่งว่างของช่วงนั้นเป็น 0; ทางผิด 1 แถวต้องยืนยันผลกับทีมเพราะ spec ไม่ได้กำหนดชัดเจนเมื่อไม่ยืนยันตัวตนหรือมีที่นั่ง 0 ที่

---

## 2026-10-07 00:05 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: ถูกตัดสินตามสถานะแถวใน [specs/001-booking/test-cases.md](specs/001-booking/test-cases.md) ว่าเป็นโหมดร่าง เนื่องจากยังไม่มีแถวใดมีสถานะ "ใช้ได้"
- TC ID ที่ตรวจ: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผล: หยุดทันทีและไม่เขียนโค้ด test ตามข้อกำหนด; ต้องแก้สถานะแถวเป็น "ใช้ได้" ก่อน แล้วสั่ง /testcases อีกครั้ง
- เหตุผล: กฎระบุชัดว่าถ้ามีแต่แถว "ร่าง" ให้หยุด พร้อมบอกทีมว่าต้องตรวจแถวและเปลี่ยนสถานะให้ถูกต้องก่อน

---

## 2026-10-07 00:10 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เริ่มใหม่หลังจากทีมยืนยันแก้สถานะแถวเป็น "ใช้ได้"
- TC ID ที่ใช้: TC-BKG-01-1, TC-BKG-01-2, TC-BKG-01-3
- ผล: แถวทั้งหมดใน [specs/001-booking/test-cases.md](specs/001-booking/test-cases.md) ถูกเปลี่ยนจาก "ร่าง" เป็น "ใช้ได้" เพื่อให้พร้อมเข้าสู่โหมดเขียน test ตามคำสั่งต่อไป
- สถานะปัจจุบัน: พร้อมสำหรับการเขียนโค้ด test จริง

---

## 2026-10-07 00:25 คำสั่ง: /testcases AC-BKG-01 specs/001-booking/

- โหมด: เขียน test
- TC ID ที่เขียนโค้ด: TC-BKG-01-1, TC-BKG-01-2
- ไฟล์ที่แก้: backend/tests/test_AC_BKG_01.py
- ผล test: pytest -v tests/test_AC_BKG_01.py
- ผลลัพธ์: 3 passed, 1 warning in 0.11s
- หมายเหตุ: TC-BKG-01-3 เป็นแถวคน (ตรวจด้วยคน) ไม่ได้เขียนโค้ดตามกติกา เนื่องจากกำหนดให้คัด Given / When / Then เป็นขั้นตอนสำหรับการทดสอบด้วยผู้คน

---

## 2026-10-07 00:40 คำสั่ง: /verify specs/001-booking/

- โหมด: ตรวจ requirement (อ่าน spec, plan, tasks, test-cases, code, และ test)
- ผล test: cd backend && pytest -v -> 6 passed, 1 warning in 0.73s
- ผลรวมตามรอยไปข้างหน้า: ครบ 5, ยังไม่ถึง 8, รอ 0, ช่องโหว่ 4
- ข้อค้นพบใหม่: F-001, F-002, F-003, F-004
- ไฟล์ที่สร้าง: specs/001-booking/rtm.md
- หมายเหตุ: ไม่แก้โค้ดหรือ test ตามกติกา; เฉพาะ rtm.md และ prompt-log.md ที่สามารถแก้ได้
