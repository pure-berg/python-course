MODULES.push({
  id: 19, week: 7, title: "async и конкурентность",
  ai: "короткую программу на Python с asyncio, которая параллельно «скачивает» 3–5 адресов (через asyncio.sleep или httpx.AsyncClient): async def, await, asyncio.gather, asyncio.create_task, замер времени, и для сравнения — последовательная версия",
  theory: `
**Зачем async:** бэкенд большую часть времени **ждёт** — ответа БД, внешнего API, диска. Пока один запрос ждёт, можно обслуживать другие. Это **конкурентность** (переключение во время ожидания), а не параллельные вычисления.

    import asyncio

    async def fetch(name, delay):       # корутина
        await asyncio.sleep(delay)      # «жду», отдав управление другим
        return name

    async def main():
        a = await fetch("A", 1)         # последовательно: 1 с
        b = await fetch("B", 1)         # ещё 1 с — итого 2 с
        results = await asyncio.gather(fetch("C", 1), fetch("D", 1))  # вместе: ~1 с
        task = asyncio.create_task(fetch("E", 1))   # запустить «в фоне»
        ...
        await task

    asyncio.run(main())                 # запустить event loop

- Вызов \`fetch()\` без \`await\` **ничего не выполняет** — только создаёт объект-корутину.
- \`await\` можно писать только внутри \`async def\`.
- \`gather\` возвращает результаты **в порядке аргументов**, а не в порядке завершения.
- **Никаких блокирующих вызовов** внутри async: \`time.sleep\`, \`requests.get\`, синхронный драйвер БД останавливают весь event loop. Нужны async-версии: \`asyncio.sleep\`, \`httpx.AsyncClient\`, \`asyncpg\`.

**Потоки и процессы:** \`threading\` — тоже для ожидания (I/O). Из-за **GIL** потоки в CPython не ускоряют вычисления на CPU — для этого \`multiprocessing\` / \`ProcessPoolExecutor\`. Итог: I/O → async или потоки, тяжёлые вычисления → процессы.
`,
  questions: [
    { run: true, q: "Что выведет код?", code: `
async def hello():
    return "привет"

r = hello()
print(type(r).__name__)
r.close()`,
      a: ["coroutine", "str", "привет", "function"],
      e: "Вызов async-функции не выполняет её тело — возвращается объект-корутина. Чтобы получить \"привет\", нужно `await hello()` внутри async-кода или `asyncio.run(hello())`. (`close()` здесь, чтобы Python не ругался «never awaited».)" },
    { run: true, q: "Что выведет код?", code: `
import asyncio

async def job(name, delay):
    await asyncio.sleep(delay)
    print(name)
    return name

async def main():
    results = await asyncio.gather(job("A", 0.2), job("B", 0.1))
    print(results)

asyncio.run(main())`,
      a: ["B\nA\n['A', 'B']", "A\nB\n['A', 'B']", "B\nA\n['B', 'A']", "A\nB\n['B', 'A']"],
      e: "Обе задачи стартуют вместе; B ждёт меньше и печатается первой. Но `gather` возвращает результаты в порядке АРГУМЕНТОВ, а не завершения: ['A', 'B']." },
    { run: true, q: "Примерно сколько секунд пройдёт? Что выведет код?", code: `
import asyncio, time

async def wait():
    await asyncio.sleep(1)

async def main():
    start = time.perf_counter()
    await asyncio.gather(wait(), wait(), wait())
    print(round(time.perf_counter() - start))

asyncio.run(main())`,
      a: ["1", "3", "0", "2"],
      e: "Три ожидания идут одновременно: пока одна корутина спит, loop переключается на другие. Итого ~1 секунда, а не 3." },
    { run: true, q: "А так? Что выведет код?", code: `
import asyncio, time

async def wait():
    await asyncio.sleep(1)

async def main():
    start = time.perf_counter()
    await wait()
    await wait()
    print(round(time.perf_counter() - start))

asyncio.run(main())`,
      a: ["2", "1", "0", "Ошибка"],
      e: "`await` по очереди — это последовательное выполнение: дождались первой, потом начали вторую. async сам по себе не ускоряет — нужен gather или create_task." },
    { run: true, q: "Что выведет код?", code: `
import asyncio, time

async def wait():
    time.sleep(1)

async def main():
    start = time.perf_counter()
    await asyncio.gather(wait(), wait())
    print(round(time.perf_counter() - start))

asyncio.run(main())`,
      a: ["2", "1", "0", "Ошибка: time.sleep нельзя в async"],
      e: "`time.sleep` — блокирующий вызов: он не отдаёт управление event loop, и корутины выполняются по очереди. Ошибки нет — просто всё тормозит. В вебе так «замерзает» весь сервер." },
    { lang: "text", q: "Почему этот код не запустится?", code: `
def main():
    data = await fetch_data()
    print(data)`,
      a: ["`await` можно использовать только внутри `async def`", "fetch_data нужно импортировать", "print нельзя после await", "Нужны скобки: await(fetch_data())"],
      e: "SyntaxError: 'await' outside async function. Функция, которая ждёт корутины, сама должна быть `async def` — «асинхронность заразна» вверх по цепочке до asyncio.run." },
    { run: true, q: "Что выведет код?", code: `
import asyncio

async def job():
    print("job")

async def main():
    task = asyncio.create_task(job())
    print("main")
    await task

asyncio.run(main())`,
      a: ["main\njob", "job\nmain", "main", "job"],
      e: "`create_task` ставит корутину в расписание, но она начнёт работать, только когда main отдаст управление (на `await`). Поэтому сначала main, потом job." },
    { q: "Где async даст выигрыш?",
      a: ["Сервис ходит в 10 внешних API и ждёт ответов", "Перемножение больших матриц", "Сжатие видео", "Подсчёт простых чисел до миллиарда"],
      e: "async помогает, когда программа ЖДЁТ (сеть, БД, диск). Вычисления на CPU он не ускоряет: всё работает в одном потоке. Для CPU — процессы (multiprocessing)." },
    { q: "Что такое GIL и на что он влияет?",
      a: ["Блокировка в CPython: в каждый момент байткод выполняет один поток, поэтому потоки не ускоряют CPU-вычисления", "Библиотека для работы с графикой", "Ограничение на количество процессов", "Механизм сборки мусора, удаляющий неиспользуемые потоки"],
      e: "Global Interpreter Lock. Пока поток ждёт I/O, GIL отпускается — поэтому потоки годятся для сети. Для вычислений — процессы. (В Python 3.13+ есть экспериментальная сборка без GIL.)" },
    { q: "ИИ написал обработчик. В чём проблема?", code: `
import requests
from fastapi import FastAPI

app = FastAPI()

@app.get("/rate")
async def rate():
    r = requests.get("https://api.example.com/rate", timeout=5)
    return r.json()`,
      a: ["requests — синхронная библиотека: в async def она блокирует event loop, нужен httpx.AsyncClient с await", "requests нельзя использовать с timeout", "async-обработчик не может возвращать JSON", "Проблемы нет"],
      e: "Пока requests ждёт ответа (до 5 секунд), сервер не обрабатывает НИ ОДИН другой запрос. Правильно: `async with httpx.AsyncClient() as c: r = await c.get(...)` — или сделать обработчик обычным `def`." },
    { q: "Что делает `asyncio.run(main())`?",
      a: ["Создаёт event loop, выполняет корутину main до конца и закрывает loop", "Запускает main в отдельном процессе", "Запускает main в фоне и сразу возвращается", "Проверяет main на ошибки без выполнения"],
      e: "Это точка входа из обычного кода в асинхронный мир. В FastAPI/uvicorn loop уже создан фреймворком, там asyncio.run не пишут." },
  ],
});
