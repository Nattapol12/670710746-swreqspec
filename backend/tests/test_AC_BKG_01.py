# test ของ T-03: จองคิวสำเร็จ
# AC-BKG-01 (FR-BKG-04)
from tests.conftest import AUTH


def test_AC_BKG_01(client, make_slot):
    """AC-BKG-01: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง จองแล้วต้องสำเร็จ"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201


def test_TC_BKG_01_1_successful_booking(client, db, make_slot):
    """# Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่
    # When: ยืนยันการจอง
    # Then: บันทึกสำเร็จ, แสดงหมายเลขคิว, และที่นั่งว่างของช่วงนั้นเป็น 0"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    data = res.json()
    assert data["slot_id"] == slot.id
    assert data["queue_no"]
    db.refresh(slot)
    assert slot.remaining == 0


def test_TC_BKG_01_2_last_seat_booking(client, db, make_slot):
    """# Given: ยืนยันตัวตนแล้ว และช่วง 09.00 น. มีที่นั่งว่าง 1 ที่ และเป็นที่นั่งสุดท้าย
    # When: ยืนยันการจอง
    # Then: บันทึกสำเร็จ, แสดงหมายเลขคิว, และที่นั่งว่างของช่วงนั้นเป็น 0"""
    slot = make_slot(start="09:00", remaining=1)

    res = client.post("/bookings", json={"slot_id": slot.id}, headers=AUTH)

    assert res.status_code == 201
    data = res.json()
    assert data["slot_id"] == slot.id
    assert data["queue_no"]
    db.refresh(slot)
    assert slot.remaining == 0
