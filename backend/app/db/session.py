import os
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import Session, sessionmaker

from app.db.models import Base


# รองรับ CON-TECH-01 และให้เครื่องทดสอบใช้ SQLite ในหน่วยความจำตาม plan.md
def get_database_url() -> str:
    return os.getenv("DATABASE_URL", "sqlite:///:memory:")


def build_engine():
    database_url = get_database_url()
    if database_url.startswith("sqlite://"):
        return create_engine(
            database_url,
            future=True,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    return create_engine(database_url, future=True)


engine = build_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base.metadata.create_all(bind=engine)


@contextmanager
def get_session() -> Session:
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
