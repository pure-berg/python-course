MODULES.push({
  id: 13, week: 5, title: "Аннотации типов и Pydantic",
  ai: "короткий пример на Python с аннотациями типов (list[int], dict[str, float], X | None) и Pydantic-моделями (BaseModel, Field с ограничениями, вложенная модель, model_dump, обработка ValidationError)",
  theory: `
**Аннотации типов** — подсказки для людей, IDE и проверяльщиков (mypy, pyright):

    def find_user(user_id: int, users: list[dict[str, str]]) -> dict[str, str] | None:
        ...
    count: int = 0
    tags: set[str] = set()

- \`list[int]\`, \`dict[str, float]\`, \`tuple[int, str]\` — что внутри коллекции
- \`str | None\` (старая запись \`Optional[str]\`) — «строка или None». Вызывающий обязан проверить None!
- \`-> None\` — функция ничего не возвращает

**Python НЕ проверяет аннотации при выполнении.** \`def f(x: int)\` спокойно примет строку. Ошибки типов находит mypy/IDE **до** запуска.

**Pydantic** — а вот он проверяет и **преобразует** данные во время выполнения. На нём построены запросы/ответы FastAPI и настройки приложений.

    from pydantic import BaseModel, Field, ValidationError

    class User(BaseModel):
        id: int
        name: str = Field(min_length=1)
        age: int | None = None
        tags: list[str] = []          # в Pydantic так можно: копируется

    u = User(id="5", name="Аня")      # "5" → 5 (преобразование)
    u.model_dump()                    # → dict
    u.model_dump_json()               # → JSON-строка
    User.model_validate({"id": 1, "name": "Боб"})   # из словаря

    try:
        User(id="abc", name="")
    except ValidationError as e:
        print(e.errors())             # список ошибок по полям

- Лишние поля по умолчанию **игнорируются** (можно запретить: \`model_config = {"extra": "forbid"}\`).
- В FastAPI неверное тело запроса автоматически даёт ответ **422** с описанием ошибок.
`,
  questions: [
    { run: true, q: "Что выведет код?", code: `
def add(a: int, b: int) -> int:
    return a + b

print(add("2", "3"))`,
      a: ["23", "5", "Ошибка TypeError: ожидался int", "Ошибка: аннотации не совпадают"],
      e: "Аннотации Python не проверяет при выполнении. Строки склеились. Ошибку заметит IDE или mypy ещё до запуска — в этом их польза." },
    { q: "Что означает аннотация `def get_user(user_id: int) -> User | None`?",
      a: ["Функция может вернуть User или None — вызывающий код должен проверить None", "Функция всегда возвращает User, None — значение по умолчанию", "user_id может быть None", "Функция выбрасывает исключение, если пользователь не найден"],
      e: "`X | None` прямо говорит: «может не найтись». Если сразу написать `user.name`, при None будет `AttributeError: 'NoneType' object has no attribute 'name'`. mypy подсветит это заранее." },
    { q: "Что описывает аннотация `list[dict[str, int]]`?",
      a: ["Список словарей, где ключи — строки, а значения — целые числа", "Словарь, где значения — списки", "Список из строк и чисел вперемешку", "Словарь с ключом list"],
      e: "Читай снаружи внутрь: список, каждый элемент — dict, у dict ключи str, значения int. Например `[{\"a\": 1}, {\"b\": 2}]`." },
    { run: true, q: "Что выведет код?", code: `
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str

u = User(id="5", name="Аня")
print(u.id + 1)`,
      a: ["6", "51", "Ошибка: id должен быть int", "Ошибка TypeError"],
      e: "Pydantic не только проверяет, но и преобразует: строка \"5\" подходит под int и превращается в 5. Так данные из JSON/форм приводятся к нужным типам." },
    { run: true, q: "Что выведет код?", code: `
from pydantic import BaseModel, ValidationError

class User(BaseModel):
    id: int
    name: str

try:
    User(id="abc", name="Аня")
except ValidationError as e:
    print(e.error_count(), e.errors()[0]["loc"])`,
      a: ["1 ('id',)", "2 ('id', 'name')", "1 ('name',)", "Ничего — ошибки нет"],
      e: "\"abc\" нельзя превратить в int — ValidationError. Pydantic собирает ВСЕ ошибки с указанием поля (`loc`). FastAPI отдаёт этот список клиенту в ответе 422." },
    { run: true, q: "Что выведет код?", code: `
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float = 0
    tags: list[str] = []

print(Item(name="чай").model_dump())`,
      a: ["{'name': 'чай', 'price': 0, 'tags': []}", "{'name': 'чай'}", "{'name': 'чай', 'price': 0.0, 'tags': None}", "Item(name='чай', price=0, tags=[])"],
      e: "`model_dump()` возвращает словарь со всеми полями, включая значения по умолчанию. Заметь: умолчание `0` не прошло валидацию и осталось int, а не float — Pydantic по умолчанию НЕ проверяет дефолты." },
    { run: true, q: "Что выведет код?", code: `
from pydantic import BaseModel, Field, ValidationError

class Order(BaseModel):
    qty: int = Field(gt=0)

try:
    Order(qty=0)
    print("создан")
except ValidationError:
    print("ошибка")`,
      a: ["ошибка", "создан", "создан\nошибка", "Ошибка TypeError"],
      e: "`Field(gt=0)` — «строго больше 0». 0 не проходит. Ограничения (`ge`, `lt`, `min_length`, `max_length`, `pattern`) задают правила прямо в модели, без ручных if." },
    { run: true, q: "Что выведет код?", code: `
from pydantic import BaseModel

class User(BaseModel):
    id: int
    name: str

print(User(id=1, name="A").model_dump_json())`,
      a: ["{\"id\":1,\"name\":\"A\"}", "{'id': 1, 'name': 'A'}", "User(id=1, name='A')", "{\"id\": \"1\", \"name\": \"A\"}"],
      e: "`model_dump_json()` сразу даёт JSON-строку (двойные кавычки, без пробелов). `model_dump()` — Python-словарь." },
    { run: true, q: "Клиент прислал лишнее поле. Что выведет код?", code: `
from pydantic import BaseModel

class UserUpdate(BaseModel):
    name: str

data = {"name": "Аня", "is_admin": True}
print(UserUpdate(**data).model_dump())`,
      a: ["{'name': 'Аня'}", "{'name': 'Аня', 'is_admin': True}", "Ошибка: лишнее поле", "{'is_admin': True}"],
      e: "Лишние поля по умолчанию отбрасываются. Это защищает: клиент не сделает себя админом, отправив `is_admin`. Отдельные модели для входа (UserUpdate) и для БД — хорошая практика." },
    { q: "Что найдёт mypy в этом коде ещё до запуска?", code: `
def total(prices: list[float]) -> float:
    return sum(prices)

result: str = total([1.5, 2.0])`,
      a: ["Функция возвращает float, а результат кладут в переменную типа str", "Ничего, код корректный", "sum нельзя применять к float", "Нельзя аннотировать переменные"],
      e: "mypy сверяет аннотации: `total` возвращает float, а `result` объявлен как str. При запуске Python ошибки бы не дал — вот почему статическая проверка ловит баги раньше." },
  ],
});
