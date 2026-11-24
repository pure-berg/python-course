import math

import pytest

import week03 as w


# ── Temperature ──────────────────────────────────────────────────────────

def test_temperature():
    t = w.Temperature(25)
    assert t.celsius == 25
    assert t.fahrenheit == pytest.approx(77.0)
    t.celsius = 0
    assert t.fahrenheit == pytest.approx(32.0)
    assert w.Temperature.from_fahrenheit(212).celsius == pytest.approx(100.0)


def test_temperature_validation():
    with pytest.raises(ValueError):
        w.Temperature(-300)
    t = w.Temperature(0)
    with pytest.raises(ValueError):
        t.celsius = -273.16


# ── BankAccount ──────────────────────────────────────────────────────────

def test_bank_account():
    acc = w.BankAccount("Аня", balance=100)
    acc.deposit(50)
    acc.withdraw(30)
    assert acc.balance == 120
    assert acc.owner == "Аня"
    assert acc.history == [("deposit", 50), ("withdraw", 30)]
    assert str(acc) == "Аня: 120"
    assert w.BankAccount("Боб").balance == 0


def test_bank_account_protects_state():
    acc = w.BankAccount("Аня", 10)
    with pytest.raises(AttributeError):
        acc.balance = 1_000_000
    acc.history.append(("hack", 1))
    assert acc.history == []
    for bad in (0, -5):
        with pytest.raises(ValueError):
            acc.deposit(bad)
        with pytest.raises(ValueError):
            acc.withdraw(bad)
    with pytest.raises(ValueError):
        acc.withdraw(11)
    assert acc.balance == 10


def test_bank_transfer():
    a, b = w.BankAccount("A", 100), w.BankAccount("B")
    a.transfer(b, 40)
    assert (a.balance, b.balance) == (60, 40)
    with pytest.raises(ValueError):
        a.transfer(b, 1000)
    assert (a.balance, b.balance) == (60, 40)


# ── Shapes ───────────────────────────────────────────────────────────────

def test_shapes():
    r, s, c = w.Rectangle(2, 3), w.Square(4), w.Circle(1)
    assert (r.area(), r.perimeter()) == (6, 10)
    assert (s.area(), s.perimeter()) == (16, 16)
    assert c.area() == pytest.approx(math.pi)
    assert c.perimeter() == pytest.approx(2 * math.pi)
    assert isinstance(s, w.Rectangle) and isinstance(s, w.Shape)


def test_shape_is_abstract():
    with pytest.raises(TypeError):
        w.Shape()


def test_shape_validation_and_compare():
    for bad in (lambda: w.Rectangle(0, 1), lambda: w.Square(-1), lambda: w.Circle(0)):
        with pytest.raises(ValueError):
            bad()
    assert w.Rectangle(2, 3) < w.Circle(10)
    assert w.Square(2) == w.Rectangle(1, 4)
    assert sorted([w.Circle(2), w.Square(1), w.Rectangle(2, 3)])[0].area() == 1


# ── Vector2D ─────────────────────────────────────────────────────────────

def test_vector_ops():
    V = w.Vector2D
    v = V(1, 2)
    assert (v.x, v.y) == (1, 2)
    assert V(1, 2) + V(3, 4) == V(4, 6)
    assert V(3, 4) - V(1, 1) == V(2, 3)
    assert V(1, 2) * 3 == V(3, 6)
    assert 3 * V(1, 2) == V(3, 6)
    assert abs(V(3, 4)) == 5.0
    assert V(1, 2) != V(2, 1)
    assert repr(V(1, 2)) == "Vector2D(1, 2)"
    assert not V(0, 0) and V(0, 1)
    assert len({V(1, 1), V(1, 1), V(2, 2)}) == 2


# ── Stack ────────────────────────────────────────────────────────────────

def test_stack():
    s = w.Stack()
    assert s.is_empty() and len(s) == 0
    s.push(1)
    s.push(2)
    assert len(s) == 2 and s.peek() == 2
    assert s.pop() == 2
    assert not s.is_empty()
    assert 1 in s and 2 not in s
    s.push(3)
    assert list(s) == [1, 3]


def test_stack_empty_errors():
    with pytest.raises(IndexError):
        w.Stack().pop()
    with pytest.raises(IndexError):
        w.Stack().peek()


def test_stacks_independent():
    a, b = w.Stack(), w.Stack()
    a.push(1)
    assert b.is_empty()


# ── Inventory ────────────────────────────────────────────────────────────

def test_inventory():
    inv = w.Inventory()
    assert inv.most_expensive() is None and len(inv) == 0
    inv.add(w.Item("ручка", 10, 5))
    inv.add(w.Item("тетрадь", 50, 2))
    inv.add(w.Item("ручка", 10, 1))
    assert len(inv) == 2 and "ручка" in inv
    assert inv.total_value() == 160
    assert inv.most_expensive().name == "тетрадь"
    inv.remove("тетрадь", 2)
    assert "тетрадь" not in inv
    inv.remove("ручка", 2)
    assert inv.total_value() == 40
    with pytest.raises(KeyError):
        inv.remove("ластик", 1)
    with pytest.raises(ValueError):
        inv.remove("ручка", 100)
