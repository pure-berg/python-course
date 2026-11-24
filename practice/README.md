# Практика: пишу код сам (по желанию)

Основной курс — [тренажёр](https://pure-berg.github.io/python-course/). Здесь лежит необязательная практика для live coding на собеседованиях и для портфолио.

| Папка | Что внутри |
|---|---|
| [week-01-basics](week-01-basics/README.md) | 14 задач на базу + консольная записная книжка |
| [week-02-functions-errors-files](week-02-functions-errors-files/README.md) | 13 задач + анализатор логов с тестами |
| [week-03-oop](week-03-oop/README.md) | 13 задач + **проект №1**: трекер расходов (CLI) |
| [week-04-advanced-algorithms](week-04-advanced-algorithms/README.md) | 16 задач + старт LeetCode |
| [week-05-sql-docker](week-05-sql-docker/README.md) | 12 SQL-запросов + трекер на БД через PR |
| [week-06-web-fastapi](week-06-web-fastapi/README.md) | учебное API (16 тестов) + **проект №2**: бэкенд-сервис |
| [week-07-async-deploy](week-07-async-deploy/README.md) | проект №2 в проде, Telegram-бот, CI, резюме |
| [week-08-interview-job](week-08-interview-job/README.md) | подготовка к собеседованиям и отклики |
| [interview](interview/README.md) | вопросы, на которые нужно уметь ответить вслух |

## Как устроены задачи

В папках недель 1–6 лежат заготовки (`week01.py`, `queries.py`, `app.py`…). Каждая задача — функция или класс с описанием, внутри `raise NotImplementedError`. Замени его своим решением и запусти тесты:

```bash
pytest practice/week-01-basics            # одна неделя
pytest                                    # вся практика
pytest practice/week-01-basics -k caesar  # одна задача
```

В конце печатается прогресс:

```
week-01-basics                 ██████░░░░   9/14   ✗ ошибок: 1   … не начато: 4
```

«Не начато» значит, что в задаче ещё стоит `NotImplementedError`. «Ошибок» значит, что решение есть, но неверное: прочитай, что пишет тест. После каждого `git push` GitHub Actions запускает те же тесты.

## Где запускать

| Где | Как |
|---|---|
| **Свой компьютер** | `git clone https://github.com/pure-berg/python-course.git`, затем `cd python-course && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt` |
| **Браузер без установки** | на странице репозитория: **Code → Codespaces → Create codespace on main**. Бесплатно примерно 60 часов в месяц, закончив работу, останавливай codespace |
| **Быстрая правка** | клавиша `.` на странице репозитория откроет github.dev (код там не запускается) |

Перед работой делай `git pull`, после — `git add . && git commit -m "..." && git push`.
