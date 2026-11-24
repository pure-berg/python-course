MODULES.push({
  id: 12, week: 4, title: "Декораторы и контекстные менеджеры",
  ai: "короткую программу на Python с двумя декораторами (замер времени и повтор при ошибке с параметром attempts) с functools.wraps, и контекстным менеджером через @contextmanager",
  theory: `
**Функции — тоже объекты:** их можно передавать, возвращать, хранить. **Замыкание** — внутренняя функция, которая помнит переменные внешней:

    def make_mult(n):
        def mult(x):
            return x * n       # n запомнилось
        return mult
    triple = make_mult(3)      # triple(5) → 15

**Декоратор** — функция, которая принимает функцию и возвращает новую (обёртку). \`@deco\` над \`def f\` — то же, что \`f = deco(f)\`, выполняется **один раз при определении**.

    import functools, time

    def timer(func):
        @functools.wraps(func)          # сохранить имя и docstring func
        def wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            print(func.__name__, time.time() - start)
            return result               # не забыть вернуть!
        return wrapper

Декоратор с параметром — ещё один уровень: \`@retry(3)\` → \`retry(3)\` возвращает декоратор. Несколько декораторов применяются **снизу вверх**: \`@a @b def f\` = \`a(b(f))\`.

Ты их постоянно видишь: \`@app.get("/users")\` в FastAPI (регистрирует обработчик), \`@pytest.fixture\`, \`@property\`, \`@functools.lru_cache\` (запоминает результаты).

**Контекстный менеджер** (\`with\`) гарантирует «вход и выход»: открыть/закрыть файл, начать/завершить транзакцию, взять/отпустить блокировку. \`__exit__\` вызывается **даже при исключении**.

    from contextlib import contextmanager

    @contextmanager
    def tag(name):
        print(f"<{name}>")     # до with-блока
        yield                  # здесь выполняется тело with
        print(f"</{name}>")    # после (для гарантии при ошибке — try/finally)
`,
  questions: [
    { run: true, q: "Что выведет код?", code: `
def make_mult(n):
    def mult(x):
        return x * n
    return mult

triple = make_mult(3)
double = make_mult(2)
print(triple(5), double(5))`,
      a: ["15 10", "10 10", "15 15", "Ошибка: n не определена"],
      e: "Каждый вызов make_mult создаёт новую функцию со своим запомненным n (замыкание). triple помнит 3, double — 2." },
    { run: true, q: "Что выведет код?", code: `
def deco(f):
    print("декорирую")
    return f

@deco
def g():
    print("g")

print("старт")
g()`,
      a: ["декорирую\nстарт\ng", "старт\nдекорирую\ng", "старт\ng", "декорирую\ng\nстарт"],
      e: "Декоратор срабатывает в момент определения функции (строка `@deco def g`), а не при вызове. Поэтому «декорирую» печатается до «старт»." },
    { run: true, q: "Что выведет код? (найди баг)", code: `
def log(f):
    def wrapper(*args, **kwargs):
        print("вызов", f.__name__)
        f(*args, **kwargs)
    return wrapper

@log
def add(a, b):
    return a + b

print(add(2, 3))`,
      a: ["вызов add\nNone", "вызов add\n5", "5", "вызов wrapper\n5"],
      e: "Обёртка вызывает f, но не возвращает её результат — значит возвращает None. Частый баг в самописных декораторах: нужно `return f(*args, **kwargs)`." },
    { run: true, q: "Что выведет код?", code: `
def deco(f):
    def wrapper():
        return f()
    return wrapper

@deco
def hello():
    return "hi"

print(hello.__name__)`,
      a: ["wrapper", "hello", "deco", "f"],
      e: "После декорирования имя hello указывает на wrapper. Без `@functools.wraps(f)` теряются имя и docstring — ломаются логи, отладка и фреймворки. С wraps было бы \"hello\"." },
    { run: true, q: "Что выведет код?", code: `
def repeat(n):
    def deco(f):
        def wrapper():
            for _ in range(n):
                f()
        return wrapper
    return deco

@repeat(2)
def hi():
    print("hi")

hi()`,
      a: ["hi\nhi", "hi", "Ошибка: repeat принимает функцию", "hi\nhi\nhi"],
      e: "`@repeat(2)` сначала вызывает `repeat(2)`, получает декоратор deco (помнящий n=2), и уже он оборачивает hi. Три уровня функций — норма для декоратора с параметрами." },
    { run: true, q: "Что выведет код?", code: `
def bold(f):
    return lambda: "<b>" + f() + "</b>"

def italic(f):
    return lambda: "<i>" + f() + "</i>"

@bold
@italic
def text():
    return "x"

print(text())`,
      a: ["<b><i>x</i></b>", "<i><b>x</b></i>", "<b>x</b>", "<i>x</i>"],
      e: "Декораторы применяются снизу вверх: `text = bold(italic(text))`. Внутренний слой — italic, внешний — bold." },
    { run: true, q: "Что выведет код?", code: `
from functools import lru_cache

calls = 0

@lru_cache
def square(n):
    global calls
    calls += 1
    return n * n

square(4)
square(4)
square(5)
print(calls)`,
      a: ["2", "3", "1", "0"],
      e: "`lru_cache` запоминает результат для каждого набора аргументов. Второй `square(4)` взят из кеша, тело не выполнялось. Тело работало для 4 и для 5 — 2 раза." },
    { run: true, q: "Что выведет код?", code: `
class Res:
    def __enter__(self):
        print("вход")
        return "ресурс"

    def __exit__(self, *args):
        print("выход")

with Res() as r:
    print(r)`,
      a: ["вход\nресурс\nвыход", "ресурс\nвход\nвыход", "вход\nвыход\nресурс", "вход\n<Res object>\nвыход"],
      e: "`with` вызывает `__enter__`, его РЕЗУЛЬТАТ кладёт в переменную после `as`, выполняет блок и в конце вызывает `__exit__`." },
    { run: true, q: "Что выведет код?", code: `
class Res:
    def __enter__(self):
        print("вход")

    def __exit__(self, *args):
        print("выход")

try:
    with Res():
        raise ValueError("бум")
except ValueError:
    print("поймано")`,
      a: ["вход\nвыход\nпоймано", "вход\nпоймано", "вход\nпоймано\nвыход", "поймано"],
      e: "При исключении внутри with сначала вызывается `__exit__` (ресурс освобождается), потом исключение летит дальше и ловится снаружи. В этом весь смысл with." },
    { run: true, q: "Что выведет код?", code: `
from contextlib import contextmanager

@contextmanager
def tag(name):
    print(f"<{name}>")
    yield
    print(f"</{name}>")

with tag("p"):
    print("текст")`,
      a: ["<p>\nтекст\n</p>", "текст\n<p>\n</p>", "<p>\n</p>\nтекст", "<p>текст</p>"],
      e: "`@contextmanager` превращает генератор в контекстный менеджер: код до `yield` — вход, тело with выполняется на месте yield, код после — выход." },
    { lang: "text", q: "Что такое `@app.get(\"/users\")` в FastAPI с точки зрения Python?", code: `
@app.get("/users")
def list_users():
    return [{"id": 1}]`,
      a: ["Декоратор с параметром: регистрирует функцию как обработчик GET-запросов на /users", "Вызов функции list_users при старте", "Комментарий для документации", "Специальный синтаксис, который есть только в FastAPI"],
      e: "`app.get(\"/users\")` возвращает декоратор, который запоминает функцию в таблице маршрутов приложения. Обычный Python-механизм, ничего магического." },
  ],
});
