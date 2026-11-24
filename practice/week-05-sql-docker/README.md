# Неделя 5. SQL, PostgreSQL, Docker, git в команде

**Цель недели:** писать SQL-запросы с JOIN, GROUP BY и оконными функциями; поднимать PostgreSQL в Docker; работать с ветками и pull request'ами.

Без SQL бэкенд-джуна не берут. Без Docker — берут неохотно.

## План по дням

### День 1 — SELECT
- [ ] Реляционная модель: таблица, строка, первичный и внешний ключ.
- [ ] `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`, `DISTINCT`, `LIKE`, `IN`, `BETWEEN`, `IS NULL`.
- [ ] Интерактивный тренажёр: [SQL Academy](https://sql-academy.org/ru/trainer) — задачи 1–20 **или** [SQLBolt](https://sqlbolt.com/) (англ.).
- [ ] Задачи q01–q02 в [queries.py](queries.py). Схема и данные — в [schema.sql](schema.sql).

### День 2 — агрегаты и JOIN
- [ ] `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING` (и чем отличается от `WHERE`).
- [ ] `INNER JOIN`, `LEFT JOIN` — нарисуй себе круги, пока не станет очевидно, откуда берутся `NULL`.
- [ ] Задачи q03–q07.

### День 3 — подзапросы, оконные функции, индексы
- [ ] Подзапросы, `EXISTS`, CTE (`WITH ... AS`).
- [ ] Оконные функции: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `SUM() OVER (PARTITION BY ...)`.
- [ ] Индексы: что это, зачем, когда вредят. `EXPLAIN`.
- [ ] Транзакции и ACID (обзорно — на собеседовании спросят).
- [ ] Задачи q08–q12.

### День 4 — Docker
- [ ] Что такое образ, контейнер, volume, порт. Зачем Docker разработчику.
- [ ] Официальный [Get started](https://docs.docker.com/get-started/) — первые разделы.
- [ ] `docker run`, `docker ps`, `docker logs`, `docker exec -it`, `docker compose up -d` / `down`.
- [ ] Подними PostgreSQL через [docker-compose.yml](docker-compose.yml) из этой папки: `docker compose up -d`, затем
  `docker compose exec db psql -U course -d course` и выполни свои запросы q01–q12 там (схема загрузится сама).
- [ ] Напиши `Dockerfile` для трекера расходов из недели 3 и запусти его в контейнере.

### День 5 — Python + БД
- [ ] Модуль `sqlite3`: соединение, курсор, **параметризованные запросы** (`?`) — и почему f-строка в SQL = SQL-инъекция.
- [ ] SQLAlchemy 2.0: модели (`DeclarativeBase`, `Mapped`), сессия, `select()`. [Учебник SQLAlchemy](https://docs.sqlalchemy.org/en/20/tutorial/).
- [ ] Переведи хранение трекера расходов с JSON на SQLite через SQLAlchemy (новая ветка!).

### День 6 — git в команде
- [ ] Ветки: `git switch -c feature/sqlite`, `git merge`, `git rebase` (обзорно), конфликты — создай конфликт специально и разреши.
- [ ] Pull Request на GitHub: из ветки `feature/sqlite` в `main` трекера, опиши изменения, смёрджи.
- [ ] Learn Git Branching — разделы «Перемещение по проекту» и «Удалённые репозитории».
- [ ] `.gitignore`, `git stash`, `git log --oneline --graph`, `git restore`.

### День 7 — отдых / повторение

## Проверь себя
1. `WHERE` vs `HAVING`?
2. `INNER JOIN` vs `LEFT JOIN` — что вернётся для пользователя без заказов?
3. Что такое индекс? Почему не повесить индексы на все колонки?
4. Что такое транзакция? Расшифруй ACID.
5. Что такое SQL-инъекция и как от неё защититься?
6. Нормализация — зачем? Что такое 1НФ, 2НФ, 3НФ (обзорно)?
7. Образ vs контейнер? Что такое volume и зачем он для БД?
8. `git merge` vs `git rebase`?

## Готово, если
`pytest practice/week-05-sql-docker` зелёный; Postgres поднимается через compose; трекер расходов работает на SQLAlchemy, изменения влиты через PR.
