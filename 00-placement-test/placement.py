"""Входной тест: практика.

Замени `raise NotImplementedError` на решение. Проверка: `pytest 00-placement-test`
Задачи идут от простых к сложным. Застрял на задаче дольше 15 минут — переходи к следующей.
"""


# 1 ─────────────────────────────────────────────────────────────────────────
def sum_of_evens(nums: list[int]) -> int:
    """Сумма чётных чисел списка.

    >>> sum_of_evens([1, 2, 3, 4, -6])
    0
    >>> sum_of_evens([])
    0
    """
    raise NotImplementedError


# 2 ─────────────────────────────────────────────────────────────────────────
def count_vowels(text: str) -> int:
    """Количество гласных (английских aeiou и русских аеёиоуыэюя), регистр не важен.

    >>> count_vowels("Hello, Мир!")
    3
    """
    raise NotImplementedError


# 3 ─────────────────────────────────────────────────────────────────────────
def longest_word(sentence: str) -> str:
    """Самое длинное слово (слова разделены пробелами). Если таких несколько —
    первое из них. Пустая строка → "".

    >>> longest_word("я люблю программировать на питоне")
    'программировать'
    """
    raise NotImplementedError


# 4 ─────────────────────────────────────────────────────────────────────────
def char_frequency(s: str) -> dict[str, int]:
    """Сколько раз встречается каждый символ.

    >>> char_frequency("abca")
    {'a': 2, 'b': 1, 'c': 1}
    """
    raise NotImplementedError


# 5 ─────────────────────────────────────────────────────────────────────────
def remove_duplicates(items: list) -> list:
    """Убрать повторы, СОХРАНИВ порядок первого появления.

    >>> remove_duplicates([3, 1, 3, 2, 1])
    [3, 1, 2]
    """
    raise NotImplementedError


# 6 ─────────────────────────────────────────────────────────────────────────
def invert_dict(d: dict) -> dict:
    """Перевернуть словарь: значение → список ключей с этим значением
    (ключи в списке — в порядке их появления в исходном словаре).

    >>> invert_dict({"a": 1, "b": 2, "c": 1})
    {1: ['a', 'c'], 2: ['b']}
    """
    raise NotImplementedError


# 7 ─────────────────────────────────────────────────────────────────────────
class ShoppingCart:
    """Корзина покупок.

    cart = ShoppingCart()
    cart.add("хлеб", 50)           # qty по умолчанию 1
    cart.add("молоко", 90, qty=2)
    cart.add("хлеб", 50)           # тот же товар — увеличивает количество
    cart.total()        -> 280
    cart.items_count()  -> 4       # сумма количеств
    cart.remove("молоко")          # удаляет товар целиком
    cart.remove("сыр")             # нет такого товара → KeyError

    add() с price < 0 или qty < 1 → ValueError.
    """

    def __init__(self):
        raise NotImplementedError

    def add(self, name: str, price: float, qty: int = 1) -> None:
        raise NotImplementedError

    def remove(self, name: str) -> None:
        raise NotImplementedError

    def total(self) -> float:
        raise NotImplementedError

    def items_count(self) -> int:
        raise NotImplementedError


# 8 ─────────────────────────────────────────────────────────────────────────
def flatten_deep(nested: list) -> list:
    """Развернуть список ЛЮБОЙ глубины вложенности.

    >>> flatten_deep([1, [2, [3, [4]], 5], [], 6])
    [1, 2, 3, 4, 5, 6]
    """
    raise NotImplementedError
