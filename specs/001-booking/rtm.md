# RTM: จองคิวตรวจสุขภาพ (Booking)
อ้างอิง: spec.md Draft v2 | tasks.md | test-cases.md
สร้างด้วย /verify เมื่อ 2026-10-07 00:40 | test: 6 ผ่าน 0 ไม่ผ่าน

## 1. ตามรอยไปข้างหน้า (requirement ไป โค้ด ไป test)
| ID | AC | task | โค้ด (ไฟล์: ฟังก์ชัน) | test (ผล) | สถานะ |
|---|---|---|---|---|---|
| CON-TECH-01 | — | T-01 | backend/app/config.py: DATABASE_URL; backend/app/db/migrations/001_init.py: upgrade | backend/tests/test_T01_schema.py: passed | ครบ |
| DOM-PDPA-01 | AC-BKG-06 | T-08 | backend/app/db/models.py: AuditLog (ตารางเท่านั้น); ไม่มี audit middleware หรือ endpoint ที่บันทึกทุกการเข้าถึง | ไม่มี test จริงสำหรับ AC-BKG-06 | ยังไม่ถึง |
| IF-IDP-01 | — | T-03 | backend/app/auth/idp.py: get_verified_hn | ไม่มี test ชัดเจนสำหรับ token 401 แต่ AC-BKG-01 ใช้ header ที่ยืนยันตัวตนแล้วผ่าน | ครบ |
| IF-HIS-01 | — | T-09 | ไม่พบ backend/app/his/client.py หรือ webhook/query HIS | ไม่มี test | ยังไม่ถึง |
| IF-NOT-01 | — | T-07 | ไม่พบ backend/app/notify/queue.py หรือระบบคิวส่งซ้ำ | ไม่มี test | ยังไม่ถึง |
| FR-BKG-01 | AC-BKG-05 | T-02 | backend/app/slots/router.py: get_slots; backend/app/slots/service.py: list_available_slots | backend/tests/test_AC_BKG_05.py: passed | ช่องโหว่ |
| FR-BKG-02 | AC-BKG-02 | T-04 | ไม่พบ logic ปฏิเสธการจองซ้ำวันเดียวกัน; backend/app/booking/service.py:create_booking ไม่มีตรวจ duplicate | ไม่มี test | ยังไม่ถึง |
| FR-BKG-03 | AC-BKG-03 | T-05, T-11, T-12 | ไม่พบ logic เสนอ 3 ช่วงใกล้เคียงและ 409 พร้อมตัวเลือก | ไม่มี test | ยังไม่ถึง |
| FR-BKG-04 | AC-BKG-01 | T-03, T-06 | backend/app/booking/service.py: create_booking, next_queue_no; backend/app/booking/router.py: create_booking | backend/tests/test_AC_BKG_01.py: 3 passed | ช่องโหว่ |
| FR-BKG-05 | AC-BKG-04 | T-07 | ไม่พบ queue resend logic หรือสถานะส่งซ้ำภายใน 5 นาที | ไม่มี test | ยังไม่ถึง |
| FR-BKG-06 | — | T-02, T-10 | backend/app/slots/service.py: list_available_slots(package_code=...) และ router รับ package_code | ไม่มี test หน้าจอหรือ backend อย่างชัดเจน | ครบ |
| NFR-PERF-01 | AC-BKG-05 | T-02 | backend/app/slots/service.py: query ในช่วงวันที่ + remaining > 0 | backend/tests/test_AC_BKG_05.py: passed | ครบ |
| NFR-REL-02 | AC-BKG-04 | T-07 | ไม่พบ retry queue หรือระบบส่งซ้ำภายใน 5 นาที | ไม่มี test | ยังไม่ถึง |
| NFR-SEC-01 | — | — | ไม่พบการบังคับ TLS 1.2 หรือ encryption ใน app/config.py หรือ request/response layer | ไม่มี test | ยังไม่ถึง |
| NFR-USE-01 | — | — | ไม่พบการทดสอบผู้ใช้ใหม่ 8/10 หรือผลการวัด 3 นาที | ไม่มี test | ยังไม่ถึง |

## 2. ตามรอยย้อนกลับ (โค้ด ไป requirement)
| โค้ด (ไฟล์: ฟังก์ชัน หรือ endpoint) | อ้าง ID | ตรงกับข้อความใน spec ไหม | หมายเหตุ |
|---|---|---|---|
| backend/app/slots/router.py: get_slots | FR-BKG-01, FR-BKG-06 | ไม่ครบ | route รับ package_code และคืน remaining แต่ใช้ช่วง 14 วัน ไม่ใช่ 30 วันตาม spec |
| backend/app/booking/router.py: create_booking | FR-BKG-04, IF-IDP-01 | ส่วนใหญ่ตรง | บันทึก booking, ตัดที่นั่ง, ตรวจ Bearer token; แต่ยังไม่มีผลลัพธ์สำหรับกรณีเต็มหรือถัดไป 1 วัน |
| backend/app/booking/service.py: create_booking | FR-BKG-04 | ส่วนใหญ่ตรง | คำนวณ queue_no เป็น A001 แบบสุ่มจาก Q-02 ที่ยังไม่ได้ถามคำตอบ |
| backend/app/auth/idp.py: get_verified_hn | IF-IDP-01 | ตรง | ตรวจ Authorization header แบบ Bearer verified:<HN> และ raise 401 ถ้าไม่ได้ยืนยัน |
| backend/app/db/models.py: Slot, Booking, AuditLog | CON-TECH-01, IF-HIS-01, DOM-PDPA-01 | บางส่วนตรง | ตาราง bookings ไม่มี national_id อย่างถูกต้อง แต่ไม่มี audit middleware จริงและไม่มี HIS client |
| backend/app/config.py: DATABASE_URL | CON-TECH-01 | ตรง | ตั้งค่า PostgreSQL ใน production แต่โหมดทดสอบใช้ SQLite ในนิรภัยและไม่ได้บังคับ TLS |

## 3. ข้อค้นพบ
ชนิด: AC ไม่มี test / test อ่อน / โค้ดไม่มี FR / FR ไม่มี AC / เดา Q-xx / ละเมิด Constraint / ตัวเลขไม่ตรง spec / อ้าง ID ผิดเรื่อง
ทีมตัดสิน: แก้โค้ด / แก้ spec / เพิ่ม Q-xx / ไม่ใช่ปัญหา (พร้อมเหตุผล 1 บรรทัด)

| F-ID | ชนิด | อยู่ที่ | ขัดกับ | รายละเอียด | ทีมตัดสิน |
|---|---|---|---|---|---|
| F-001 | ตัวเลขไม่ตรง spec | backend/app/slots/service.py: DAYS_AHEAD = 14 | FR-BKG-01 | spec ระบุภายใน 30 วันข้างหน้า แต่โค้ดแสดงแค่ 14 วัน จึงไม่ตรงกับข้อกำหนดใน spec | ว่าง |
| F-002 | เดา Q-xx | backend/app/booking/service.py: next_queue_no | FR-BKG-04, Q-02 | โค้ดใช้รูปแบบ A001 เหมือนตัดสินรูปแบบหมายเลขคิวเอง โดยที่ spec ยังมี Q-02 ว่ายังไม่ได้คำตอบ | ว่าง |
| F-003 | AC ไม่มี test | AC-BKG-06 / DOM-PDPA-01 | AC-BKG-06 | ไม่มี test ใน backend/tests/ และไม่มี audit middleware ที่สร้าง audit log จริง จึงไม่มีหลักฐานว่าความจริงตรงตาม AC | ว่าง |
| F-004 | FR ไม่มี AC | backend/app/slots/service.py: list_available_slots(package_code=...) | FR-BKG-06 | FR-BKG-06 มีใน spec แต่ไม่มี AC ที่ตรวจแบบบังคับ จึงเป็นช่องโหว่ของ spec เอง แม้โค้ดจะทำได้บางส่วน | ว่าง |

## 4. แก้แล้ว
| F-ID | แก้อย่างไร | รู้ได้อย่างไร |
|---|---|---|
| - | ยังไม่มีข้อค้นพบที่ได้รับการแก้ไขจากทีมในรอบนี้ | ยังไม่ตรวจแก้โค้ดหรือ spec โดย AI ตามข้อกำหนด |
