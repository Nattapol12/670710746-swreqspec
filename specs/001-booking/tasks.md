# Tasks: จองคิวตรวจสุขภาพ (Booking)
- Feature: จองคิวตรวจสุขภาพ (Booking)
- Spec ID: SPEC-BKG-001
- อ้างอิง plan.md: specs/001-booking/plan.md
- วันที่: 2569-09-23

## สรุป
- ทำทั้งหมด 11 task
- มี 1 task ที่ต้องรอ Open Questions (Q-02)

## รายการ task

### T-01 สร้าง schema และ migration ฐานข้อมูล
- รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-01
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/db/session.py, backend/app/db/migrations/001_init.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: migration สร้างตาราง slots, bookings, audit_logs และระบบสามารถเชื่อมต่อ PostgreSQL ได้ตามข้อกำหนด
- สถานะ: เสร็จ รอทีมตรวจ

### T-02 ค้นหาช่วงเวลาว่างและคำนวณที่นั่งคงเหลือ
- รองรับ: FR-BKG-01, FR-BKG-06, NFR-PERF-01
- ตรวจด้วย: AC-BKG-05
- ไฟล์ที่แตะ: backend/app/slots/router.py, backend/app/slots/service.py, backend/app/config.py
- ต้องทำหลัง: T-01
- เสร็จเมื่อ: GET /slots คืนรายการช่วงเวลาและจำนวนที่นั่งคงเหลือภายใน 30 วัน พร้อมสามารถวัด p95 ได้ไม่เกิน 2 วินาทีภายใต้โหลด 200 คน
- สถานะ: พร้อมทำ

### T-03 สร้าง API การจองพื้นฐาน
- รองรับ: FR-BKG-04, IF-IDP-01, CON-TECH-01
- ตรวจด้วย: AC-BKG-01
- ไฟล์ที่แตะ: backend/app/booking/router.py, backend/app/booking/service.py, backend/app/auth/idp.py
- ต้องทำหลัง: T-01, T-02
- เสร็จเมื่อ: POST /bookings บันทึกการจองได้สำเร็จ แสดงหมายเลขคิว และที่นั่งคงเหลือของช่วงนั้นลดลงเป็น 0
- สถานะ: พร้อมทำ

### T-04 ป้องกันการจองซ้ำวันเดียวกัน
- รองรับ: FR-BKG-02, IF-IDP-01
- ตรวจด้วย: AC-BKG-02
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/booking/router.py
- ต้องทำหลัง: T-03
- เสร็จเมื่อ: เมื่อผู้รับบริการมีคิวยังไม่ได้ใช้ในวันเดียวกัน ระบบปฏิเสธการจองใหม่และส่งกลับหมายเลขคิวเดิม
- สถานะ: พร้อมทำ

### T-05 จัดการช่วงเวลาที่เต็มและเสนอ 3 ตัวเลือกใกล้เคียง
- รองรับ: FR-BKG-03, IF-IDP-01
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: backend/app/booking/service.py, backend/app/slots/service.py, backend/app/booking/router.py
- ต้องทำหลัง: T-02, T-03
- เสร็จเมื่อ: เมื่อช่วงเวลาที่เลือกเต็ม ระบบคืน 409 พร้อม 3 ตัวเลือกที่ใกล้ที่สุดภายในวันเดียวกันและวันถัดไป และไม่มีการจองซ้อนเกิดขึ้น
- สถานะ: พร้อมทำ

### T-06 จัดการคิวส่งข้อความยืนยันและส่งซ้ำ
- รองรับ: FR-BKG-05, NFR-REL-02, IF-NOT-01
- ตรวจด้วย: AC-BKG-04
- ไฟล์ที่แตะ: backend/app/notify/queue.py, backend/app/booking/service.py, backend/app/booking/router.py
- ต้องทำหลัง: T-03, T-04
- เสร็จเมื่อ: หากส่งข้อความไม่สำเร็จ การจองยังถูกบันทึกและมีรายการค้างส่งที่กำหนดให้ retry ภายใน 5 นาที
- สถานะ: พร้อมทำ

### T-07 บันทึก audit log และค้น HN จาก HIS
- รองรับ: DOM-PDPA-01, IF-HIS-01, IF-IDP-01
- ตรวจด้วย: AC-BKG-06
- ไฟล์ที่แตะ: backend/app/audit/middleware.py, backend/app/his/client.py, backend/app/booking/router.py
- ต้องทำหลัง: T-01, T-03
- เสร็จเมื่อ: ทุกการเข้าถึงข้อมูลการจองมี audit log ที่ระบุผู้เข้าถึง เวลา และ HN และระบบไม่เก็บเลขบัตรประชาชนในตารางการจอง
- สถานะ: พร้อมทำ

### T-08 สร้างหน้าเลือกแพ็กเกจและช่วงเวลา (API จำลอง)
- รองรับ: FR-BKG-01, FR-BKG-06
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-08
- ไฟล์ที่แตะ: frontend/src/pages/SlotPicker.jsx, frontend/src/App.jsx, frontend/src/api/client.js
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: หน้าเลือกแพ็กเกจและช่วงเวลาแสดงรายการ slot ที่ว่างและเปลี่ยนแพ็กเกจแล้วโหลดช่วงเวลาใหม่ตามแพ็กเกจที่เลือก
- สถานะ: เสร็จ รอทีมตรวจ

### T-09 สร้างหน้ายืนยันและแสดงผลการจอง (API จำลอง)
- รองรับ: FR-BKG-03, FR-BKG-04
- ตรวจด้วย: AC-BKG-03
- ไฟล์ที่แตะ: frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx, frontend/src/__tests__/AC-BKG-03.test.jsx
- ต้องทำหลัง: T-08, T-05
- เสร็จเมื่อ: หน้ายืนยันแสดงข้อความ “ช่วงเวลาเต็ม” พร้อม 3 ตัวเลือกที่ใกล้ที่สุด และหน้าผลการจองแสดงหมายเลขคิวที่ได้รับ
- สถานะ: พร้อมทำ

### T-10 ต่อหน้าจอกับ API จริงหลังบ้าน
- รองรับ: FR-BKG-01, FR-BKG-03, FR-BKG-04, IF-NOT-01
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-10
- ไฟล์ที่แตะ: frontend/src/api/client.js, frontend/src/pages/SlotPicker.jsx, frontend/src/pages/ConfirmBooking.jsx, frontend/src/pages/BookingResult.jsx
- ต้องทำหลัง: T-08, T-09, T-02, T-05, T-06
- เสร็จเมื่อ: หน้าจอเชื่อมต่อกับ API จริงได้โดยไม่ใช้ mock และสามารถทำงานตามสัญญา API ที่กำหนด
- สถานะ: พร้อมทำ

### T-11 กำหนดรูปแบบหมายเลขคิวและการแสดงผล
- รองรับ: FR-BKG-04, FR-BKG-05
- ตรวจด้วย: ไม่มี AC ตรง ๆ เป็นงานพื้นฐานของ T-11
- ไฟล์ที่แตะ: backend/app/db/models.py, backend/app/booking/service.py, backend/app/booking/router.py
- ต้องทำหลัง: ไม่มี
- เสร็จเมื่อ: รูปแบบหมายเลขคิวและแนวทางรีเซ็ตรายวันหรือหมายเลขต่อเนื่องได้รับคำตอบจากเจ้าหน้าที่เวชระเบียนแล้ว พร้อมใช้งานกับประสบการณ์ผู้ใช้
- สถานะ: รอ Q-02

## ตารางตรวจความครบ

### AC ID | task ที่ตรวจ AC นี้
| AC ID | task ที่ตรวจ AC นี้ |
|---|---|
| AC-BKG-01 | T-03 |
| AC-BKG-02 | T-04 |
| AC-BKG-03 | T-05, T-09 |
| AC-BKG-04 | T-06 |
| AC-BKG-05 | T-02 |
| AC-BKG-06 | T-07 |

### Constraint ID | task ที่ทำให้เป็นจริง
| Constraint ID | task ที่ทำให้เป็นจริง |
|---|---|
| CON-TECH-01 | T-01, T-03 |
| DOM-PDPA-01 | T-01, T-07 |
| IF-IDP-01 | T-03, T-04, T-05, T-06, T-07 |
| IF-HIS-01 | T-01, T-07 |
| IF-NOT-01 | T-06, T-10 |

## สิ่งที่ยังไม่ทำ
- Q-02: หมายเลขคิวรีเซ็ตรายวัน หรือนับต่อเนื่อง และมีรูปแบบอย่างไร (เช่น A001)?
  - รอ task: T-11
