(() => {
const HEAD = `from fastapi import FastAPI, HTTPException, Depends
from fastapi.testclient import TestClient
from pydantic import BaseModel

app = FastAPI()
`;

MODULES.push({
  id: 17, week: 6, title: "FastAPI",
  ai: "небольшое приложение FastAPI (одно-два файла) для списка задач: GET со списком и query-параметрами limit/done, GET по id с HTTPException 404, POST с Pydantic-моделью и status_code=201, response_model, зависимость через Depends",
  theory: `
**FastAPI** — фреймворк для API: функции-обработчики + Pydantic-модели + автоматическая документация.

    from fastapi import FastAPI, HTTPException, Depends
    from pydantic import BaseModel

    app = FastAPI()

    class TaskIn(BaseModel):
        title: str
        done: bool = False

    class TaskOut(TaskIn):
        id: int

    @app.get("/tasks/{task_id}", response_model=TaskOut)
    def get_task(task_id: int):                 # path-параметр, приводится к int
        task = TASKS.get(task_id)
        if task is None:
            raise HTTPException(status_code=404, detail="Задача не найдена")
        return task

    @app.get("/tasks")
    def list_tasks(limit: int = 10, done: bool | None = None):   # query: /tasks?limit=5
        ...

    @app.post("/tasks", status_code=201, response_model=TaskOut)
    def create_task(data: TaskIn):              # тело запроса — JSON по модели
        ...

- Параметр из \`{...}\` в пути — **path**; простой параметр функции — **query**; параметр-модель Pydantic — **тело**.
- Неверные данные → FastAPI сам отвечает **422** с описанием ошибки.
- \`response_model\` фильтрует ответ: лишние поля (например, пароль) не уйдут клиенту.
- **Depends** — внедрение зависимостей: сессия БД, текущий пользователь, общие параметры. FastAPI вызовет функцию-зависимость и передаст результат.
- Маршруты проверяются **по порядку**: \`/users/me\` нужно объявить раньше \`/users/{user_id}\`.
- Запуск: \`uvicorn main:app --reload\` (файл main.py, объект app). Документация: \`/docs\`.
- \`async def\` — если внутри \`await\` (async-драйверы, httpx.AsyncClient). Обычный \`def\` FastAPI выполнит в пуле потоков. Блокирующий вызов внутри \`async def\` тормозит весь сервер.

**Тесты:** \`TestClient(app).get("/tasks/1")\` — запрос без запуска сервера.
`,
  questions: [
    { run: true, q: "Что выведет код?", code: HEAD + `
@app.get("/items/{item_id}")
def get_item(item_id: int):
    return {"id": item_id * 2}

client = TestClient(app)
print(client.get("/items/5").json())`,
      a: ["{'id': 10}", "{'id': '55'}", "{'id': 5}", "{'item_id': 10}"],
      e: "`{item_id}` в пути — path-параметр. Аннотация `int` заставляет FastAPI превратить строку \"5\" из URL в число, поэтому 5 × 2 = 10." },
    { run: true, q: "Что выведет код?", code: HEAD + `
@app.get("/items/{item_id}")
def get_item(item_id: int):
    return {"id": item_id}

client = TestClient(app)
print(client.get("/items/abc").status_code)`,
      a: ["422", "404", "500", "200"],
      e: "\"abc\" не превращается в int — FastAPI сам отвечает 422 Unprocessable Entity с описанием, какое поле неверно. Твой код даже не вызывается." },
    { run: true, q: "Что выведет код?", code: HEAD + `
@app.get("/items")
def list_items(limit: int = 10, q: str | None = None):
    return {"limit": limit, "q": q}

client = TestClient(app)
print(client.get("/items").json())
print(client.get("/items?limit=3&q=чай").json())`,
      a: ["{'limit': 10, 'q': None}\n{'limit': 3, 'q': 'чай'}", "{'limit': 10, 'q': None}\n{'limit': '3', 'q': 'чай'}", "Ошибка 422 в первом запросе: не передан limit", "{}\n{'limit': 3, 'q': 'чай'}"],
      e: "Параметры функции, которых нет в пути, — query-параметры. Значение по умолчанию делает их необязательными. Типы приводятся: \"3\" → 3." },
    { run: true, q: "Что выведет код?", code: HEAD + `
class UserIn(BaseModel):
    name: str
    age: int

@app.post("/users")
def create(user: UserIn):
    return user

client = TestClient(app)
print(client.post("/users", json={"name": "Аня"}).status_code)`,
      a: ["422", "200", "201", "400"],
      e: "Параметр-модель Pydantic = тело запроса. Поле `age` обязательное, его не прислали → 422 и список ошибок. Вручную проверять ничего не нужно." },
    { run: true, q: "Что выведет код?", code: HEAD + `
USERS = {1: "Аня"}

@app.get("/users/{user_id}")
def get_user(user_id: int):
    if user_id not in USERS:
        raise HTTPException(status_code=404, detail="Не найден")
    return {"name": USERS[user_id]}

client = TestClient(app)
r = client.get("/users/2")
print(r.status_code, r.json())`,
      a: ["404 {'detail': 'Не найден'}", "200 {'name': None}", "500 {'detail': 'Не найден'}", "404 Не найден"],
      e: "`raise HTTPException(...)` прерывает обработчик, и FastAPI возвращает клиенту указанный статус и JSON `{\"detail\": ...}`. Просто `return None` дал бы 200 с `null` — плохой API." },
    { run: true, q: "Что выведет код?", code: HEAD + `
class UserOut(BaseModel):
    id: int
    name: str

@app.get("/me", response_model=UserOut)
def me():
    return {"id": 1, "name": "Аня", "password_hash": "$2b$12$..."}

client = TestClient(app)
print(client.get("/me").json())`,
      a: ["{'id': 1, 'name': 'Аня'}", "{'id': 1, 'name': 'Аня', 'password_hash': '$2b$12$...'}", "Ошибка 500: лишнее поле", "{'password_hash': '$2b$12$...'}"],
      e: "`response_model` пропускает ответ через модель UserOut, и поля, которых в ней нет, отбрасываются. Это защита от утечки хеша пароля и внутренних полей." },
    { run: true, q: "Что выведет код?", code: HEAD + `
@app.post("/tasks", status_code=201)
def create_task():
    return {"id": 1}

client = TestClient(app)
print(client.post("/tasks").status_code)`,
      a: ["201", "200", "204", "422"],
      e: "По умолчанию FastAPI отвечает 200. `status_code=201` в декораторе задаёт правильный код «создано» для POST." },
    { run: true, q: "Что выведет код?", code: HEAD + `
def pagination(page: int = 1, size: int = 20):
    return {"offset": (page - 1) * size, "limit": size}

@app.get("/products")
def products(p: dict = Depends(pagination)):
    return p

client = TestClient(app)
print(client.get("/products?page=3&size=10").json())`,
      a: ["{'offset': 20, 'limit': 10}", "{'offset': 30, 'limit': 10}", "{'page': 3, 'size': 10}", "{'offset': 0, 'limit': 20}"],
      e: "`Depends(pagination)` — FastAPI сам вызывает зависимость, разбирая её параметры из запроса (page=3, size=10), и передаёт результат в `p`. Смещение: (3−1)×10 = 20. Так же внедряют сессию БД и текущего пользователя." },
    { run: true, q: "Что выведет код? (частый баг)", code: HEAD + `
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}

@app.get("/users/me")
def get_me():
    return {"id": "я"}

client = TestClient(app)
print(client.get("/users/me").status_code)`,
      a: ["422", "200", "404", "500"],
      e: "Маршруты проверяются по порядку. `/users/me` совпал с шаблоном `/users/{user_id}`, \"me\" не int → 422. До `get_me` дело не дошло. Фикс: объявить `/users/me` выше." },
    { lang: "bash", q: "Что значит эта команда?", code: `uvicorn main:app --reload`,
      a: ["Запустить сервер с объектом app из файла main.py и перезапускать при изменении кода", "Установить пакет main и app", "Запустить тесты из main.py", "Собрать Docker-образ"],
      e: "uvicorn — ASGI-сервер, который реально принимает HTTP. `main:app` = модуль:переменная. `--reload` только для разработки, в проде его не включают." },
    { q: "Что не так в этом обработчике?", code: `
import time
from fastapi import FastAPI

app = FastAPI()

@app.get("/report")
async def report():
    time.sleep(5)          # «тяжёлая» работа
    return {"ok": True}`,
      a: ["Блокирующий time.sleep в async def останавливает весь сервер на 5 секунд для всех запросов", "Нельзя возвращать словарь из async-функции", "Нужно писать @app.get(\"/report\", async=True)", "Ничего, так и задумано"],
      e: "async-обработчики выполняются в одном event loop. Блокирующий вызов (time.sleep, requests, sync-драйвер БД) замораживает его. Варианты: `await asyncio.sleep`, async-библиотеки, или объявить обработчик обычным `def` — FastAPI запустит его в отдельном потоке." },
  ],
});
})();
