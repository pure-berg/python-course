"""Неделя 3 — задачи. Проверка: pytest week-03-oop

Здесь нет готовых заготовок методов: класс нужно спроектировать самому
по описанию. Тесты подскажут, если что-то не так названо.
"""
from abc import ABC, abstractmethod  # noqa: F401
from dataclasses import dataclass, field  # noqa: F401
import math  # noqa: F401


class Temperature:
    """Температура.

    t = Temperature(25)          # в градусах Цельсия
    t.celsius     -> 25
    t.fahrenheit  -> 77.0        # свойство (property), C * 9/5 + 32
    t.celsius = -300             # ниже абсолютного нуля (-273.15) → ValueError
    Temperature(-300)            # → ValueError
    Temperature.from_fahrenheit(212).celsius -> 100.0   # classmethod
    """

    def __init__(self, celsius: float):
        raise NotImplementedError


class BankAccount:
    """Банковский счёт.

    acc = BankAccount("Аня")              # баланс 0
    acc = BankAccount("Аня", balance=100)
    acc.owner     -> "Аня"
    acc.balance   -> 100                  # только чтение (property без сеттера)
    acc.deposit(50)                       # amount <= 0 → ValueError
    acc.withdraw(30)                      # amount <= 0 → ValueError, больше баланса → ValueError
    acc.history   -> [("deposit", 50), ("withdraw", 30)]   # КОПИЯ списка операций
    acc.transfer(other_acc, 20)           # снимает здесь, кладёт там
    str(acc)      -> "Аня: 120"
    """

    def __init__(self, owner: str, balance: float = 0):
        raise NotImplementedError


# ── Фигуры ───────────────────────────────────────────────────────────────
# Shape — абстрактный класс (ABC) с абстрактными методами area() и perimeter().
# Shape() напрямую создать нельзя (TypeError — это сделает ABC сам).
# Rectangle(w, h), Square(side) — наследник Rectangle, Circle(r).
# Размеры <= 0 → ValueError.
# Фигуры сравниваются по площади: Rectangle(2, 3) < Circle(10) → True
# (достаточно определить __lt__ и __eq__ в Shape).

class Shape:
    def __init__(self):
        raise NotImplementedError


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        raise NotImplementedError


class Square(Rectangle):
    def __init__(self, side: float):
        raise NotImplementedError


class Circle(Shape):
    def __init__(self, radius: float):
        raise NotImplementedError


class Vector2D:
    """Вектор на плоскости.

    v = Vector2D(1, 2)
    v.x, v.y                      -> 1, 2
    Vector2D(1, 2) + Vector2D(3, 4)   -> Vector2D(4, 6)
    Vector2D(3, 4) - Vector2D(1, 1)   -> Vector2D(2, 3)
    Vector2D(1, 2) * 3            -> Vector2D(3, 6)
    3 * Vector2D(1, 2)            -> Vector2D(3, 6)     # подсказка: __rmul__
    abs(Vector2D(3, 4))           -> 5.0
    Vector2D(1, 2) == Vector2D(1, 2)  -> True
    repr(Vector2D(1, 2))          -> "Vector2D(1, 2)"
    bool(Vector2D(0, 0))          -> False
    Векторы можно класть в set и использовать как ключи dict (__hash__).
    """

    def __init__(self, x: float, y: float):
        raise NotImplementedError


class Stack:
    """Стек (последним пришёл — первым ушёл).

    s = Stack()
    s.push(1); s.push(2)
    len(s)        -> 2
    s.peek()      -> 2         # посмотреть верхний, не удаляя
    s.pop()       -> 2
    s.is_empty()  -> False
    2 in s        -> False      # __contains__
    list(s)       -> [1]        # __iter__: от низа к верху
    Stack().pop() / Stack().peek() → IndexError("стек пуст")
    """

    def __init__(self):
        raise NotImplementedError


# ── Склад ────────────────────────────────────────────────────────────────
# Item — dataclass(name: str, price: float, qty: int = 0).
# Inventory:
#   inv = Inventory()
#   inv.add(Item("ручка", 10, 5))       # если товар с таким name уже есть — увеличить qty
#   inv.remove("ручка", 2)              # уменьшить qty; если стало 0 — удалить товар;
#                                       # нет товара → KeyError; qty больше, чем есть → ValueError
#   inv.total_value()  -> 30            # сумма price * qty
#   inv.most_expensive() -> Item(...)   # по цене за штуку; пустой склад → None
#   len(inv)           -> число разных товаров
#   "ручка" in inv     -> True

@dataclass
class Item:
    name: str
    price: float
    qty: int = 0


class Inventory:
    def __init__(self):
        raise NotImplementedError
