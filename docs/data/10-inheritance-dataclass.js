MODULES.push({
  id: 10, week: 4, title: "Наследование, магические методы, dataclass",
  ai: "короткий пример на Python с базовым классом и двумя наследниками: super().__init__, переопределение методов, __str__/__repr__/__eq__/__len__, и тот же пример данных, переписанный через @dataclass с field(default_factory=list)",
  theory: `
**Наследование:** класс-потомок получает атрибуты и методы родителя и может их **переопределить**.

    class Animal:
        def __init__(self, name):
            self.name = name
        def speak(self):
            return "..."

    class Dog(Animal):
        def __init__(self, name, breed):
            super().__init__(name)   # вызвать __init__ родителя!
            self.breed = breed
        def speak(self):             # переопределение
            return "Гав"

\`isinstance(obj, Animal)\` — True и для потомков. Вызов метода ищется сначала в классе объекта, потом у родителей — поэтому код родителя, вызывающий \`self.speak()\`, получит версию потомка (полиморфизм).

**Магические методы** (dunder) — встроенное поведение объекта:

- \`__str__\` — для \`print()\` и \`str()\`, «для людей»; \`__repr__\` — для отладки, списков, консоли
- \`__eq__\` — \`==\` (по умолчанию сравниваются адреса, а не содержимое!); \`__lt__\` — \`<\` и сортировка
- \`__len__\` — \`len()\`, \`__getitem__\` — \`obj[i]\`, \`__iter__\` — \`for x in obj\`

**dataclass** генерирует \`__init__\`, \`__repr__\`, \`__eq__\` сам:

    from dataclasses import dataclass, field

    @dataclass
    class Point:
        x: int
        y: int = 0
        tags: list[str] = field(default_factory=list)  # НЕ tags = []

    Point(1) == Point(1, 0)   # True
    print(Point(2))           # Point(x=2, y=0, tags=[])

\`@dataclass(frozen=True)\` — неизменяемый объект, \`order=True\` — можно сравнивать \`<\`.

**Композиция часто лучше наследования:** «машина ИМЕЕТ двигатель» (\`self.engine = Engine()\`), а не «машина ЯВЛЯЕТСЯ двигателем».
`,
  questions: [
    { run: true, q: "Что выведет код?", code: `
class A:
    def __init__(self):
        self.x = 1

class B(A):
    def __init__(self):
        super().__init__()
        self.y = 2

b = B()
print(b.x, b.y)`,
      a: ["1 2", "Ошибка AttributeError: нет x", "None 2", "2 2"],
      e: "`super().__init__()` вызывает инициализатор родителя, он создаёт `self.x`. Потом B добавляет `self.y`." },
    { runErr: "AttributeError", q: "Что произойдёт?", code: `
class A:
    def __init__(self):
        self.x = 1

class B(A):
    def __init__(self):
        self.y = 2

print(B().x)`,
      a: ["Ошибка AttributeError: у объекта нет атрибута x", "Выведется 1", "Выведется None", "Выведется 2"],
      e: "B переопределил `__init__` и не вызвал родительский — код, создающий `self.x`, не выполнился. Классическая ошибка: забыть `super().__init__()`." },
    { run: true, q: "Что выведет код?", code: `
class P:
    def __str__(self):
        return "точка"

    def __repr__(self):
        return "P()"

p = P()
print(p, [p])`,
      a: ["точка [P()]", "точка [точка]", "P() [P()]", "P() [точка]"],
      e: "`print(p)` использует `__str__`. Но список при печати показывает элементы через `__repr__`. Поэтому repr стоит делать информативным — его ты видишь в логах и отладчике." },
    { run: true, q: "Что выведет код?", code: `
class P:
    def __init__(self, x):
        self.x = x

print(P(1) == P(1))`,
      a: ["False", "True", "Ошибка", "None"],
      e: "Без `__eq__` оператор `==` сравнивает, один ли это объект в памяти. Здесь два разных объекта. Определи `__eq__` или используй `@dataclass` — он сравнивает поля." },
    { run: true, q: "Что выведет код?", code: `
from dataclasses import dataclass

@dataclass
class P:
    x: int
    y: int = 0

print(P(1) == P(1, 0), P(2))`,
      a: ["True P(x=2, y=0)", "False P(x=2, y=0)", "True <__main__.P object at ...>", "True (2, 0)"],
      e: "dataclass сгенерировал `__eq__` (сравнение по полям) и `__repr__` (имя класса и поля). Это экономит десятки строк шаблонного кода." },
    { runErr: "ValueError", q: "Что произойдёт?", code: `
from dataclasses import dataclass

@dataclass
class Order:
    items: list = []`,
      a: ["Ошибка ValueError: изменяемое умолчание запрещено, нужно field(default_factory=list)", "Всё нормально, у каждого заказа свой список", "Все заказы будут делить один список, но ошибки не будет", "Ошибка TypeError: list — не тип"],
      e: "dataclass защищает от бага «общий список по умолчанию» и падает сразу. Правильно: `items: list = field(default_factory=list)` — новый список для каждого объекта." },
    { run: true, q: "Что выведет код?", code: `
class Cart:
    def __init__(self):
        self.items = ["хлеб", "молоко", "сыр"]

    def __len__(self):
        return len(self.items)

print(len(Cart()))`,
      a: ["3", "Ошибка TypeError: у Cart нет len()", "1", "None"],
      e: "Встроенная `len(obj)` вызывает `obj.__len__()`. Так свои классы встраиваются в язык. Заодно пустая корзина станет ложной в `if cart:`." },
    { run: true, q: "Что выведет код?", code: `
class A: pass
class B(A): pass

print(isinstance(B(), A), type(B()) == A)`,
      a: ["True False", "True True", "False False", "False True"],
      e: "`isinstance` учитывает наследование: B — это тоже A. `type(...) ==` сравнивает точный класс. Поэтому проверки типов пишут через isinstance." },
    { run: true, q: "Что выведет код?", code: `
class V:
    def __init__(self, n):
        self.n = n

    def __lt__(self, other):
        return self.n < other.n

    def __repr__(self):
        return f"V({self.n})"

print(sorted([V(3), V(1), V(2)]))`,
      a: ["[V(1), V(2), V(3)]", "[V(3), V(1), V(2)]", "Ошибка TypeError: нельзя сравнить V", "[V(3), V(2), V(1)]"],
      e: "`sorted` сравнивает элементы оператором `<`, который вызывает `__lt__`. Без него была бы ошибка `'<' not supported`. Альтернатива — `sorted(items, key=lambda v: v.n)`." },
    { runErr: "dataclasses.FrozenInstanceError", q: "Что произойдёт?", code: `
from dataclasses import dataclass

@dataclass(frozen=True)
class Money:
    amount: int

m = Money(5)
m.amount = 10`,
      a: ["Ошибка FrozenInstanceError: поле замороженного объекта менять нельзя", "m.amount станет 10", "Создастся новый объект Money(10)", "Изменение молча проигнорируется"],
      e: "`frozen=True` делает объект неизменяемым (и хешируемым — можно класть в set и делать ключом). «Изменить» значит создать новый: `dataclasses.replace(m, amount=10)`." },
    { run: true, q: "Что выведет код?", code: `
class Base:
    def hello(self):
        return "Привет от " + self.name()

    def name(self):
        return "базы"

class Child(Base):
    def name(self):
        return "потомка"

print(Child().hello())`,
      a: ["Привет от потомка", "Привет от базы", "Ошибка: в Child нет hello", "Привет от Child"],
      e: "`hello` унаследован от Base, но `self` — это объект Child, поэтому `self.name()` находит версию потомка. На этом построены фреймворки: ты переопределяешь один метод, а остальное работает." },
    { q: "Что лучше для «у заказа есть адрес доставки»?",
      a: ["Композиция: `self.address = Address(...)` внутри Order", "Наследование: `class Order(Address)`", "Скопировать все поля адреса в Order", "Сделать Address глобальной переменной"],
      e: "Наследование — для отношения «является» (Dog является Animal). Заказ не является адресом, он его СОДЕРЖИТ. Ошибочное наследование тащит в класс лишние методы и путает." },
  ],
});
