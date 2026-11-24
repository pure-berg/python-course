"""Неделя 2 — задачи. Проверка: pytest week-02-functions-errors-files"""
import csv  # noqa: F401  (пригодится)
import json  # noqa: F401
from pathlib import Path  # noqa: F401


# ── День 1: функции как объекты ──────────────────────────────────────────

def apply_n_times(func, n: int, x):
    """Применить func к x n раз подряд: func(func(...func(x))).

    >>> apply_n_times(lambda v: v * 2, 3, 1)
    8
    """
    raise NotImplementedError


def compose(*funcs):
    """Вернуть функцию-композицию: compose(f, g, h)(x) == f(g(h(x))).
    compose() без аргументов возвращает x без изменений.

    >>> compose(str, abs)(-5)
    '5'
    """
    raise NotImplementedError


def make_counter(start: int = 0):
    """Вернуть функцию, которая при каждом вызове возвращает следующее число,
    начиная со start. Разные счётчики независимы. (Замыкание + nonlocal.)

    >>> c = make_counter(10)
    >>> c(), c(), c()
    (10, 11, 12)
    """
    raise NotImplementedError


def to_query(**params) -> str:
    """Собрать строку запроса: ключи по алфавиту, параметры со значением None
    пропускаются.

    >>> to_query(page=2, q="python", sort=None)
    'page=2&q=python'
    """
    raise NotImplementedError


# ── День 2: исключения ───────────────────────────────────────────────────

def safe_int(value, default=None):
    """Превратить value в int; если не получается (ValueError или TypeError) —
    вернуть default.

    >>> safe_int("42"), safe_int("abc", 0), safe_int(None)
    (42, 0, None)
    """
    raise NotImplementedError


def parse_kv(line: str) -> tuple[str, str]:
    """Разобрать строку "ключ=значение" → (ключ, значение) с обрезанными пробелами.
    Значение может содержать "=" (делить по первому). Если "=" нет или ключ
    пустой — ValueError.

    >>> parse_kv(" host = example.com ")
    ('host', 'example.com')
    """
    raise NotImplementedError


class InsufficientFunds(Exception):
    """Недостаточно средств."""


def withdraw(balance: float, amount: float) -> float:
    """Снять amount с balance, вернуть новый баланс.
    amount <= 0 → ValueError; amount > balance → InsufficientFunds.
    """
    raise NotImplementedError


def retry(func, attempts: int):
    """Вызывать func() (без аргументов), пока не выполнится без исключения,
    но не больше attempts раз. Вернуть результат. Если все попытки упали —
    пробросить ПОСЛЕДНЕЕ исключение.
    """
    raise NotImplementedError


# ── День 3: файлы ────────────────────────────────────────────────────────

def read_numbers(path) -> list[float]:
    """Прочитать файл, где в каждой строке число. Пустые строки и строки,
    начинающиеся с "#", пропускать. Пробелы по краям игнорировать.
    """
    raise NotImplementedError


def top_words(path, n: int) -> list[tuple[str, int]]:
    """Топ-n самых частых слов файла (UTF-8) в нижнем регистре: список пар
    (слово, количество) по убыванию количества, при равенстве — по алфавиту.
    Словом считается последовательность букв (подсказка: re.findall(r"[^\\W\\d_]+", text)).
    """
    raise NotImplementedError


def write_csv(rows: list[dict], path) -> None:
    """Записать список словарей в CSV (UTF-8) с заголовком. Колонки — ключи
    первого словаря в их порядке. Пустой rows → создать пустой файл.
    """
    raise NotImplementedError


def load_config(path, defaults: dict) -> dict:
    """Прочитать JSON-конфиг и наложить его поверх defaults (значения из файла
    важнее). Если файла нет — вернуть копию defaults. defaults не изменять.
    Если JSON битый — ValueError с понятным сообщением.
    """
    raise NotImplementedError
