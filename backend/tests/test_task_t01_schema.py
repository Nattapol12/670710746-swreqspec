from sqlalchemy import inspect, text

from app.db.session import engine, get_session


def test_schema_creates_required_tables():
    inspector = inspect(engine)

    assert 'slots' in inspector.get_table_names()
    assert 'bookings' in inspector.get_table_names()
    assert 'audit_logs' in inspector.get_table_names()

    with get_session() as session:
        assert session.execute(text("SELECT 1")).scalar() == 1
