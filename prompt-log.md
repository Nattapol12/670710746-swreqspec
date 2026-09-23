# Prompt log

## /tasks (2569-09-23)
- ใช้กับไฟล์: specs/001-booking/spec.md
- ผลลัพธ์: สร้าง tasks.md ในโฟลเดอร์เดียวกับ spec แล้วระบุลำดับงานและตรวจความครอบคลุม AC/Constraints ครบทุกตัว
- สรุป: ทั้งหมด 11 task, 1 task รอ Q-02 (T-11) และยังไม่เริ่มทำโค้ดใด ๆ

## /implement T-01 (2569-09-23)
- ใช้กับไฟล์: specs/001-booking/tasks.md
- ไฟล์ที่แก้: backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py, backend/tests/test_task_t01_schema.py
- ผลลัพธ์: สร้าง schema ของ slots, bookings, audit_logs และเรียก Base.metadata.create_all() ให้ตารางถูกสร้างจริง
- Test: `cd backend && pytest tests/test_task_t01_schema.py -q`
- ผลการรัน: ผ่านแล้ว (1 passed)
- เหตุผลที่ต้องแก้: มี circular import ระหว่าง models.py และ session.py ทำให้ metadata ว่างก่อนเข้าถึงตาราง จึงแก้โดยย้าย Base ไปไว้ที่ models.py และให้ session.py import Base จากที่เดียว

## /implement T-08 (2569-09-23)
- ใช้กับไฟล์: specs/001-booking/tasks.md
- ไฟล์ที่แก้: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx
- ผลลัพธ์: สร้างหน้าเลือกแพ็กเกจและช่วงเวลาแบบ API จำลองที่แสดง slot ที่ว่าง และเปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่
- Test: `cd frontend && npm test`
- ผลการรัน: ผ่านแล้ว (1 test passed). มี warning ของ React act จาก async effect แต่ไม่ทำให้ test fail
- เหตุผลที่ต้องแก้: หน้าจอเริ่มต้นยังเป็นสคริปต์ placeholder และ task T-08 ต้องเชื่อม SlotPicker เข้ากับ App โดยใช้ API client ที่มีอยู่ตามสัญญา plan
