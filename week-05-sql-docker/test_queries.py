import sqlite3
from pathlib import Path

import pytest

import queries

SCHEMA = (Path(__file__).parent / "schema.sql").read_text(encoding="utf-8")

EXPECTED = {
    "Q01": [("Грокаем алгоритмы", 800), ("Python для начинающих", 900)],
    "Q02": [("Москва", 3), ("Казань", 2), ("СПб", 1)],
    "Q03": [("Аня",), ("Вика",)],
    "Q04": [("Даша",), ("Егор",)],
    "Q05": [(1, 1700), (2, 3500), (3, 3000), (4, 2400), (5, 3500), (6, 3300)],
    "Q06": [("electronics", 5000), ("books", 4700), ("home", 1200)],
    "Q07": [("Казань",), ("Москва",)],
    "Q08": [
        ("books", "Чистый код", 1200),
        ("electronics", "Клавиатура", 3500),
        ("electronics", "Наушники", 3500),
        ("home", "Кружка", 400),
    ],
    "Q09": [("Вика", 5700), ("Аня", 5200)],
    "Q10": [
        ("books", "Чистый код", 1),
        ("books", "Python для начинающих", 2),
        ("books", "Грокаем алгоритмы", 3),
        ("electronics", "Клавиатура", 1),
        ("electronics", "Наушники", 1),
        ("electronics", "Мышь", 2),
        ("home", "Кружка", 1),
    ],
    "Q11": [("2026-01", 1), ("2026-02", 3), ("2026-03", 2)],
    "Q12": [("Аня", 2), ("Вика", 2), ("Боб", 1), ("Гоша", 1), ("Даша", 0), ("Егор", 0)],
}


@pytest.fixture
def db():
    conn = sqlite3.connect(":memory:")
    conn.executescript(SCHEMA)
    yield conn
    conn.close()


@pytest.mark.parametrize("name", sorted(EXPECTED))
def test_query(db, name):
    sql = getattr(queries, name).strip()
    if not sql:
        raise NotImplementedError
    rows = db.execute(sql).fetchall()
    assert rows == EXPECTED[name]
