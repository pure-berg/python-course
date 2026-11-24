"""Проверка вопросов тренажёра (docs/data/*.js).

* структура: id/week/title/theory/ai, у каждого вопроса q, 4 уникальных варианта, объяснение e;
* все файлы из docs/data подключены в index.html, id модулей уникальны;
* вопросы с run: true — код запускается, stdout должен совпасть с a[0] (верный ответ всегда первый);
  с runErr: 'TypeError' — код должен упасть с этим исключением;
* остальной код без lang (то есть Python) должен хотя бы компилироваться.

Запуск: python tools/check_questions.py [-v]
"""
import ast
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERBOSE = "-v" in sys.argv


def main() -> int:
    raw = subprocess.run(
        ["node", str(ROOT / "tools" / "dump_modules.mjs")], capture_output=True, text=True, check=True
    ).stdout
    data = json.loads(raw)
    errors: list[str] = []
    err = errors.append

    for f in sorted(set(data["onDisk"]) - set(data["listed"])):
        err(f"{f}: файл не подключён в docs/index.html")

    ids = [m["id"] for m in data["modules"]]
    for i in {i for i in ids if ids.count(i) > 1}:
        err(f"повторяется id модуля {i}")

    total = ran = 0
    for m in data["modules"]:
        where = f"{m.get('file')} (модуль {m.get('id')})"
        for key, typ in (("id", int), ("week", int), ("title", str), ("questions", list)):
            if not isinstance(m.get(key), typ):
                err(f"{where}: нет поля {key}")
        if m.get("id") != 0:
            for key in ("theory", "ai"):
                if not isinstance(m.get(key), str) or len(m[key]) < 30:
                    err(f"{where}: пустое или короткое поле {key}")
        for i, q in enumerate(m.get("questions", [])):
            total += 1
            qid = f"{where}, вопрос {i} ({str(q.get('q', ''))[:50]!r})"
            if not isinstance(q.get("q"), str) or not q["q"].strip():
                err(f"{qid}: нет текста вопроса")
            a = q.get("a")
            if not (isinstance(a, list) and len(a) == 4 and all(isinstance(x, str) and x.strip() for x in a)):
                err(f"{qid}: нужно ровно 4 непустых варианта")
            elif len({x.strip() for x in a}) != 4:
                err(f"{qid}: варианты повторяются")
            if not isinstance(q.get("e"), str) or len(q["e"]) < 25:
                err(f"{qid}: нет объяснения или оно слишком короткое")
            if m.get("id") == 0 and not isinstance(q.get("m"), int):
                err(f"{qid}: во входном тесте нужен m (номер модуля)")
            code = q.get("code")
            if q.get("run"):
                if not code:
                    err(f"{qid}: run без code")
                    continue
                ran += 1
                with tempfile.TemporaryDirectory() as tmp:
                    p = subprocess.run(
                        [sys.executable, "-I", "-c", code], capture_output=True, text=True, timeout=20, cwd=tmp
                    )
                last = p.stderr.strip().splitlines()[-1] if p.stderr.strip() else ""
                if q.get("runErr"):   # ожидаем исключение указанного типа; a[0] — текст для человека
                    if not last.startswith(q["runErr"]):
                        err(f"{qid}: ожидалось исключение {q['runErr']}, а получено {last or 'без ошибки'!r}")
                elif p.returncode:
                    err(f"{qid}: код упал: {last}")
                else:
                    got = p.stdout.strip()
                    if isinstance(a, list) and a and got != a[0].strip():
                        err(f"{qid}: запуск дал {got!r}, а верный вариант {a[0]!r}")
                    elif isinstance(a, list) and got in [x.strip() for x in a[1:]]:
                        err(f"{qid}: неверный вариант совпадает с выводом")
                if VERBOSE:
                    print(f"ok run {qid}")
            elif code and not q.get("lang"):
                try:
                    compile(code, "<q>", "exec", flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
                except SyntaxError as e:
                    err(f"{qid}: Python-код не компилируется ({e.msg}, строка {e.lineno}); если это не Python — добавь lang")

    for e in errors:
        print("✗", e)
    print(f"Модулей: {len(data['modules'])}, вопросов: {total}, проверено запуском: {ran}, ошибок: {len(errors)}")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
