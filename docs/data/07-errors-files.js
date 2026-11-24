MODULES.push({
  id: 7, week: 3, title: "Ошибки и файлы",
  ai: "короткую программу на Python, которая читает JSON-файл с настройками и CSV-подобный текстовый файл: with open(..., encoding=\"utf-8\"), json.load/json.dump, try/except/else/finally с конкретными исключениями (FileNotFoundError, ValueError, json.JSONDecodeError), raise",
  theory: `
**Исключение** — сигнал об ошибке. Если его не поймать, программа падает и печатает **traceback**. Читай его **снизу вверх**: последняя строка — тип и текст ошибки, над ней — строка твоего кода, где всё случилось.

    try:
        n = int(text)
    except ValueError:
        print("Это не число")
    else:
        print("Получилось:", n)     # только если ошибки не было
    finally:
        print("Выполнится всегда")  # закрыть ресурсы и т.п.

- Лови **конкретные** исключения. Голый \`except:\` или \`except Exception: pass\` глотает все ошибки, включая твои баги — их потом не найти.
- Сработает **первый** подходящий \`except\` сверху вниз, поэтому общий \`Exception\` ставят последним.
- \`raise ValueError("текст")\` — бросить исключение самому, например при неправильных входных данных.
- Свой тип: \`class NotEnoughMoney(Exception): pass\`.

Частые типы: \`ValueError\` (неверное значение), \`TypeError\` (неверный тип), \`KeyError\`, \`IndexError\`, \`AttributeError\`, \`FileNotFoundError\`, \`ZeroDivisionError\`.

**Файлы:**

    with open("notes.txt", "w", encoding="utf-8") as f:
        f.write("строка\\n")
    with open("notes.txt", encoding="utf-8") as f:
        for line in f:
            print(line.strip())

Режимы: \`"r"\` — чтение (по умолчанию), \`"w"\` — запись **с затиранием**, \`"a"\` — дописать в конец. \`with\` сам закроет файл. Всегда указывай \`encoding="utf-8"\`: иначе на Windows кириллица может сломаться.

**JSON** ↔ Python: \`json.dumps(obj)\` → строка, \`json.loads(str)\` → объект; \`json.dump(obj, f)\` / \`json.load(f)\` — сразу с файлом. \`true/false/null\` в JSON = \`True/False/None\` в Python.
`,
  questions: [
    { run: true, q: "Что выведет код?", code: `
try:
    x = int("abc")
    print("число")
except ValueError:
    print("не число")`,
      a: ["не число", "число", "число\nне число", "Ошибка ValueError"],
      e: "`int(\"abc\")` бросает ValueError, строка `print(\"число\")` не выполняется — управление сразу переходит в except." },
    { run: true, q: "Что выведет код?", code: `
try:
    print(1)
    raise ValueError("упс")
    print(2)
except ValueError:
    print(3)
finally:
    print(4)`,
      a: ["1\n3\n4", "1\n2\n3\n4", "1\n3", "1\n4"],
      e: "После `raise` остаток try пропускается (2 не печатается). Исключение поймано — печатается 3. `finally` выполняется всегда — 4." },
    { run: true, q: "Что выведет код?", code: `
try:
    x = 10 / 2
except ZeroDivisionError:
    print("деление на ноль")
else:
    print("ок", x)`,
      a: ["ок 5.0", "деление на ноль", "ок 5", "ничего"],
      e: "Блок `else` после try выполняется, только если исключения НЕ было. `10 / 2` — это float 5.0." },
    { lang: "text", q: "Программа упала с таким сообщением. Где и какая ошибка?", code: `
Traceback (most recent call last):
  File "/app/main.py", line 12, in <module>
    total = calc_total(cart)
  File "/app/main.py", line 5, in calc_total
    return sum(item["price"] for item in items)
KeyError: 'price'`,
      a: ["В строке 5: у какого-то товара нет ключа \"price\"", "В строке 12: неправильно вызвана calc_total", "В Python ошибка, нужно обновить версию", "В строке 1: Traceback не импортирован"],
      e: "Traceback читаем снизу: `KeyError: 'price'` — нет ключа price. Строка прямо над ним — место ошибки (line 5, в calc_total). Строка 12 — откуда эту функцию вызвали." },
    { q: "Почему так писать плохо?", code: `
try:
    process_order(order)
except:
    pass`,
      a: ["Глотаются ВСЕ ошибки, включая баги — программа молча работает неправильно", "Это синтаксическая ошибка", "pass замедляет программу", "except без имени ловит только SyntaxError"],
      e: "Голый except ловит всё (даже Ctrl+C), а `pass` прячет проблему. Лови конкретное исключение и хотя бы логируй его: `except ValueError as e: logger.warning(e)`." },
    { run: true, q: "Что выведет код?", code: `
def set_age(age):
    if age < 0:
        raise ValueError("возраст < 0")
    return age

try:
    set_age(-5)
except ValueError as e:
    print("Ошибка:", e)`,
      a: ["Ошибка: возраст < 0", "-5", "Ошибка: ValueError", "Программа упадёт с traceback"],
      e: "`raise` бросает исключение с текстом. `except ValueError as e` ловит его и кладёт объект в e; `print(e)` показывает текст сообщения." },
    { run: true, q: "Что выведет код?", code: `
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("a\\nb\\n")

with open("t.txt", encoding="utf-8") as f:
    print(len(f.readlines()))`,
      a: ["2", "1", "4", "3"],
      e: "Записали две строки, каждая заканчивается `\\n`. `readlines()` возвращает список строк файла: ['a\\n', 'b\\n'] — 2 элемента." },
    { run: true, q: "Что выведет код?", code: `
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("1")
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("2")
with open("t.txt", "a", encoding="utf-8") as f:
    f.write("3")
print(open("t.txt", encoding="utf-8").read())`,
      a: ["23", "123", "3", "2"],
      e: "Режим \"w\" стирает файл при открытии — от \"1\" ничего не осталось. \"a\" (append) дописывает в конец. Итог: \"2\" + \"3\"." },
    { run: true, q: "Что выведет код?", code: `
import json
print(json.dumps({"a": [1, 2], "ok": True, "x": None}))`,
      a: ["{\"a\": [1, 2], \"ok\": true, \"x\": null}", "{'a': [1, 2], 'ok': True, 'x': None}", "{\"a\": [1, 2], \"ok\": True, \"x\": None}", "{a: [1, 2], ok: true, x: null}"],
      e: "JSON — это текст по своим правилам: двойные кавычки, `true/false`, `null`. `json.dumps` переводит Python-объект в такую строку." },
    { run: true, q: "Что выведет код?", code: `
try:
    int("x")
except Exception:
    print("общая")
except ValueError:
    print("значение")`,
      a: ["общая", "значение", "общая\nзначение", "Ошибка"],
      e: "Except проверяются сверху вниз. ValueError — подкласс Exception, поэтому сработал первый блок, а второй недостижим. Конкретные исключения ставят ВЫШЕ общих." },
    { q: "Зачем в `open()` указывать `encoding=\"utf-8\"`?",
      a: ["Без него кодировка зависит от системы (на Windows — cp1251), и кириллица может прочитаться кракозябрами или упасть", "Иначе файл откроется только для чтения", "Это ускоряет чтение больших файлов", "Без этого нельзя использовать with"],
      e: "По умолчанию Python берёт кодировку ОС. Код, работающий на Mac/Linux, может сломаться на Windows. Явный utf-8 делает поведение одинаковым везде." },
  ],
});
