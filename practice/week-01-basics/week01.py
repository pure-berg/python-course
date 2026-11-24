"""Неделя 1 — задачи. Проверка: pytest week-01-basics

Правило: сначала решаешь сам. Застрял на 20+ минут — перечитай теорию,
потом напиши маленький пример в консоли. Готовое решение не ищи.
"""


# ── День 2: строки и условия ─────────────────────────────────────────────

def fizzbuzz(n: int) -> list[str]:
    """Числа от 1 до n строками; кратные 3 → "Fizz", кратные 5 → "Buzz",
    кратные 15 → "FizzBuzz".

    >>> fizzbuzz(5)
    ['1', '2', 'Fizz', '4', 'Buzz']
    """
    raise NotImplementedError


def is_palindrome(s: str) -> bool:
    """Палиндром ли строка, если игнорировать регистр, пробелы и знаки препинания
    (учитываются только буквы и цифры).

    >>> is_palindrome("А роза упала на лапу Азора")
    True
    """
    raise NotImplementedError


def caesar(text: str, shift: int) -> str:
    """Шифр Цезаря для латиницы: каждая буква сдвигается на shift по алфавиту
    по кругу, регистр сохраняется, остальные символы не меняются.
    shift может быть отрицательным и больше 26.

    >>> caesar("Hello, World!", 3)
    'Khoor, Zruog!'
    """
    raise NotImplementedError


# ── День 3: циклы и списки ───────────────────────────────────────────────

def second_largest(nums: list[int]) -> int | None:
    """Второе по величине РАЗЛИЧНОЕ число. Если его нет — None.

    >>> second_largest([4, 1, 4, 3])
    3
    >>> second_largest([7, 7])
    """
    raise NotImplementedError


def chunks(items: list, size: int) -> list[list]:
    """Разбить список на куски длины size (последний может быть короче).

    >>> chunks([1, 2, 3, 4, 5], 2)
    [[1, 2], [3, 4], [5]]
    """
    raise NotImplementedError


def flatten(list_of_lists: list[list]) -> list:
    """Развернуть ОДИН уровень вложенности.

    >>> flatten([[1, 2], [3], []])
    [1, 2, 3]
    """
    raise NotImplementedError


def running_sum(nums: list[float]) -> list[float]:
    """Накопительная сумма.

    >>> running_sum([1, 2, 3, 4])
    [1, 3, 6, 10]
    """
    raise NotImplementedError


# ── День 4: словари и множества ──────────────────────────────────────────

def count_words(text: str) -> dict[str, int]:
    """Частота слов без учёта регистра. Слова разделены пробелами,
    знаки .,!?:; по краям слова отбрасываются.

    >>> count_words("Мама мыла раму. Раму мыла мама!")
    {'мама': 2, 'мыла': 2, 'раму': 2}
    """
    raise NotImplementedError


def group_by_first_letter(words: list[str]) -> dict[str, list[str]]:
    """Сгруппировать слова по первой букве (в нижнем регистре), порядок слов
    внутри группы — как во входе. Пустые строки пропускать.

    >>> group_by_first_letter(["apple", "Avocado", "banana"])
    {'a': ['apple', 'Avocado'], 'b': ['banana']}
    """
    raise NotImplementedError


def merge_sum(a: dict[str, int], b: dict[str, int]) -> dict[str, int]:
    """Объединить словари, значения общих ключей сложить. Исходные не менять.

    >>> merge_sum({"x": 1, "y": 2}, {"y": 3, "z": 4})
    {'x': 1, 'y': 5, 'z': 4}
    """
    raise NotImplementedError


def common_elements(a: list, b: list) -> list:
    """Элементы, которые есть в обоих списках, без повторов, отсортированные.

    >>> common_elements([3, 1, 2, 2], [2, 3, 4])
    [2, 3]
    """
    raise NotImplementedError


# ── День 5: функции ──────────────────────────────────────────────────────

def most_common_char(s: str) -> str | None:
    """Самый частый символ (пробелы не считаются). При равенстве — тот, что
    встретился раньше. Пустая строка → None.

    >>> most_common_char("abracadabra")
    'a'
    """
    raise NotImplementedError


def transpose(matrix: list[list[int]]) -> list[list[int]]:
    """Транспонировать прямоугольную матрицу.

    >>> transpose([[1, 2, 3], [4, 5, 6]])
    [[1, 4], [2, 5], [3, 6]]
    """
    raise NotImplementedError


def roman_to_int(s: str) -> int:
    """Римское число → int (1..3999). I=1 V=5 X=10 L=50 C=100 D=500 M=1000;
    меньшая цифра перед большей вычитается (IV=4, XC=90).

    >>> roman_to_int("MCMXCIV")
    1994
    """
    raise NotImplementedError
