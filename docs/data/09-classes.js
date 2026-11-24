MODULES.push({
  id: 9, week: 3, title: "Классы и объекты",
  ai: "короткий класс на Python для банковского счёта или корзины покупок: __init__ и self, атрибуты экземпляра и класса, методы, проверка входных данных с raise ValueError, @property и @classmethod",
  theory: `
**Класс** — шаблон, **объект (экземпляр)** — конкретная вещь по шаблону. Класс объединяет данные (атрибуты) и действия над ними (методы).

    class Account:
        bank = "PyBank"                 # атрибут КЛАССА — общий для всех

        def __init__(self, owner, balance=0):
            self.owner = owner          # атрибуты ЭКЗЕМПЛЯРА — свои у каждого
            self._balance = balance

        def deposit(self, amount):
            if amount <= 0:
                raise ValueError("Сумма должна быть > 0")
            self._balance += amount

        @property
        def balance(self):              # читается как атрибут: acc.balance
            return self._balance

    acc = Account("Аня", 100)   # вызывается __init__
    acc.deposit(50)             # = Account.deposit(acc, 50)

- **self** — сам объект, у которого вызвали метод. Python передаёт его автоматически первым аргументом, поэтому в определении метода он обязателен.
- **\`__init__\`** — инициализатор: заполняет атрибуты нового объекта. Ничего не возвращает.
- **\`_balance\`** — одно подчёркивание: «внутреннее, снаружи не трогай». Это договорённость, а не запрет.
- **Атрибут класса** общий для всех экземпляров. Изменяемый атрибут класса (\`items = []\`) — частый баг: список окажется общим.
- **\`@property\`** — метод, который читается как поле, без скобок.
- **\`@classmethod\`** получает класс (\`cls\`) вместо объекта — для альтернативных конструкторов: \`User.from_dict(data)\`.
- **\`@staticmethod\`** — обычная функция внутри класса, без self/cls.
`,
  questions: [
    { run: true, q: "Что выведет код?", code: `
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name}: Гав"

print(Dog("Рекс").bark())`,
      a: ["Рекс: Гав", "self.name: Гав", "Dog: Гав", "Ошибка: bark вызван без аргумента"],
      e: "`Dog(\"Рекс\")` создаёт объект и вызывает `__init__`, который сохраняет имя в `self.name`. В `bark` тот же объект приходит как self." },
    { q: "Что такое `self` в методе?",
      a: ["Объект, у которого вызвали метод; Python передаёт его автоматически", "Ключевое слово, обозначающее класс", "Глобальная переменная с текущим модулем", "Копия объекта, чтобы не испортить оригинал"],
      e: "`d.bark()` Python превращает в `Dog.bark(d)`. Имя `self` — соглашение (можно иначе, но так не делают). Через self метод читает и меняет данные конкретного объекта." },
    { runErr: "TypeError", q: "Что произойдёт?", code: `
class Dog:
    def bark():
        return "Гав"

Dog().bark()`,
      a: ["Ошибка TypeError: bark() получил 1 аргумент, а принимает 0", "Выведется Гав", "Вернётся «Гав», но ничего не напечатается", "Ошибка NameError: self не определён"],
      e: "Python всегда передаёт объект первым аргументом, а метод объявлен без параметров. Отсюда `TypeError: Dog.bark() takes 0 positional arguments but 1 was given`. Нужно `def bark(self):`." },
    { run: true, q: "Что выведет код?", code: `
class Cart:
    items = []

    def add(self, x):
        self.items.append(x)

a = Cart()
b = Cart()
a.add("хлеб")
print(b.items)`,
      a: ["['хлеб']", "[]", "Ошибка AttributeError", "None"],
      e: "`items` — атрибут КЛАССА, один список на всех. `self.items.append` меняет его, и это видно из b. Правильно создавать список в `__init__`: `self.items = []`." },
    { run: true, q: "Что выведет код?", code: `
class A:
    x = 1

a = A()
b = A()
a.x = 5
print(a.x, b.x, A.x)`,
      a: ["5 1 1", "5 5 5", "5 5 1", "1 1 1"],
      e: "`a.x = 5` не меняет атрибут класса — оно создаёт НОВЫЙ атрибут у объекта a, который заслоняет классовый. b и A по-прежнему видят 1. (С `append` из прошлого вопроса иначе: там объект меняли, а не присваивали.)" },
    { q: "Что напечатает `print(Dog(\"Рекс\"))`, если в классе нет `__str__` и `__repr__`?",
      a: ["Что-то вроде `<__main__.Dog object at 0x7f...>`", "Рекс", "Dog(name='Рекс')", "Ошибка: объект нельзя напечатать"],
      e: "По умолчанию печатается имя класса и адрес в памяти — для отладки бесполезно. Красивый вывод задают методами `__str__` / `__repr__` (следующий модуль) или используют dataclass." },
    { run: true, q: "Что выведет код?", code: `
class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    @property
    def area(self):
        return self.w * self.h

r = Rect(2, 3)
r.w = 4
print(r.area)`,
      a: ["12", "6", "<bound method Rect.area ...>", "Ошибка: area нужно вызывать со скобками"],
      e: "`@property` вычисляет значение при каждом обращении, без скобок. Ширину поменяли на 4 → 4 × 3 = 12. Площадь не хранится отдельно и не «устаревает»." },
    { runErr: "TypeError", q: "В том же классе Rect с `@property area`. Что произойдёт?", code: `
class Rect:
    def __init__(self, w, h):
        self.w, self.h = w, h

    @property
    def area(self):
        return self.w * self.h

print(Rect(2, 3).area())`,
      a: ["Ошибка TypeError: 'int' object is not callable", "Выведется 6", "Выведется None", "Ошибка AttributeError"],
      e: "`.area` уже вернуло число 6, а потом `()` пытается «вызвать» число. Свойства читаются без скобок." },
    { run: true, q: "Что выведет код?", code: `
class User:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @classmethod
    def from_string(cls, s):
        name, age = s.split(",")
        return cls(name, int(age))

u = User.from_string("Аня,30")
print(u.name, u.age + 1)`,
      a: ["Аня 31", "Аня 301", "Аня,30 31", "Ошибка"],
      e: "`@classmethod` получает класс как `cls` и создаёт через него объект — это альтернативный конструктор. Возраст переведён в int, поэтому `+ 1` даёт 31." },
    { q: "Что означает подчёркивание в `self._balance`?",
      a: ["Соглашение: это внутренний атрибут, снаружи класса его лучше не трогать", "Python запрещает доступ к нему снаружи", "Атрибут становится константой", "Атрибут не сохраняется в объекте"],
      e: "Python не запрещает `acc._balance = 10**6`, но подчёркивание говорит другим разработчикам: «это деталь реализации». Менять баланс надо через методы с проверками." },
    { run: true, q: "ИИ написал класс счёта. Что выведет код?", code: `
class Account:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Недостаточно средств")
        self.balance -= amount

acc = Account(100)
acc.withdraw(30)
try:
    acc.withdraw(100)
except ValueError as e:
    print(acc.balance, e)`,
      a: ["70 Недостаточно средств", "-30 Недостаточно средств", "70", "0 Недостаточно средств"],
      e: "Первое снятие прошло: 100 − 30 = 70. Второе (100 > 70) бросило исключение ДО изменения баланса, поэтому он остался 70. Проверка перед изменением — правильный порядок." },
  ],
});
