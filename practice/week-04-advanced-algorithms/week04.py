"""Неделя 4 — задачи. Проверка: pytest week-04-advanced-algorithms

В алгоритмических задачах (День 4–5) в комментарии указана целевая сложность.
Решение «в лоб» тоже засчитают тесты, но на собеседовании спросят про оптимальное.
"""
from collections import Counter, defaultdict, deque  # noqa: F401
from contextlib import contextmanager  # noqa: F401
import functools  # noqa: F401


# ── День 1: итераторы и генераторы ───────────────────────────────────────

def fib():
    """БЕСКОНЕЧНЫЙ генератор чисел Фибоначчи: 0, 1, 1, 2, 3, 5, ...
    (используй yield)."""
    raise NotImplementedError


def chunked(iterable, size: int):
    """Генератор: выдаёт списки длины size из ЛЮБОГО итерируемого (в т.ч.
    бесконечного генератора), последний может быть короче. Не превращай вход
    в список целиком!

    >>> list(chunked(range(5), 2))
    [[0, 1], [2, 3], [4]]
    """
    raise NotImplementedError


class Countdown:
    """Итерируемый объект: for x in Countdown(3) → 3, 2, 1.
    По одному объекту Countdown можно пройти циклом несколько раз
    (подсказка: __iter__ может быть генератором).
    """

    def __init__(self, start: int):
        raise NotImplementedError


# ── День 2: декораторы и контекстные менеджеры ───────────────────────────

def count_calls(func):
    """Декоратор: считает вызовы в атрибуте wrapper.calls; сохраняет имя и
    docstring функции (functools.wraps)."""
    raise NotImplementedError


def memoize(func):
    """Декоратор-кеш: для одинаковых позиционных аргументов функция реально
    вызывается один раз. Не используй functools.lru_cache/cache — напиши сам."""
    raise NotImplementedError


def suppress(*exceptions):
    """Контекстный менеджер: глушит перечисленные исключения, остальные
    пропускает наружу.

    with suppress(KeyError):
        {}["x"]           # тишина
    """
    raise NotImplementedError


# ── День 4: алгоритмы ────────────────────────────────────────────────────

def binary_search(sorted_nums: list[int], target: int) -> int:
    """Индекс target в отсортированном списке или -1. O(log n). Без bisect."""
    raise NotImplementedError


def two_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    """Индексы (i, j), i < j, таких что nums[i] + nums[j] == target.
    Если пар несколько — с наименьшим j. Нет — None. O(n) через dict."""
    raise NotImplementedError


def valid_brackets(s: str) -> bool:
    """Правильно ли расставлены скобки ()[]{}; прочие символы игнорировать.
    O(n), стек.

    >>> valid_brackets("f(a[1]) { }")
    True
    >>> valid_brackets("(]")
    False
    """
    raise NotImplementedError


def merge_sorted(a: list[int], b: list[int]) -> list[int]:
    """Слить два отсортированных списка в один отсортированный.
    O(len(a) + len(b)), два указателя. Без sorted()."""
    raise NotImplementedError


# ── День 5: алгоритмы ────────────────────────────────────────────────────

def group_anagrams(words: list[str]) -> list[list[str]]:
    """Сгруппировать анаграммы. Порядок групп — по первому появлению,
    внутри группы — как во входе.

    >>> group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
    [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]
    """
    raise NotImplementedError


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """k самых частых чисел, по убыванию частоты; при равной частоте —
    меньшее число раньше."""
    raise NotImplementedError


def max_subarray(nums: list[int]) -> int:
    """Максимальная сумма непрерывного непустого подмассива. O(n) (алгоритм Кадане).

    >>> max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])
    6
    """
    raise NotImplementedError


def rle_encode(s: str) -> str:
    """Сжатие повторов: "aaabccdddd" → "a3bc2d4" (одиночный символ без цифры)."""
    raise NotImplementedError


def longest_unique_substring(s: str) -> int:
    """Длина самой длинной подстроки без повторяющихся символов.
    O(n), скользящее окно.

    >>> longest_unique_substring("abcabcbb")
    3
    """
    raise NotImplementedError
