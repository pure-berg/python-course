"""Неделя 6 — учебное API задач. Спецификация — в README.md этой папки.

Проверка: pytest week-06-web-fastapi
Ручной запуск (из корня репозитория): fastapi dev week-06-web-fastapi/app.py

Тесты вызывают create_app() перед КАЖДЫМ тестом и ждут новое приложение
с пустым хранилищем. Поэтому храни задачи не в глобальной переменной модуля,
а внутри create_app() (замыкание) или в app.state.
"""
from fastapi import FastAPI, HTTPException, Response, status  # noqa: F401
from pydantic import BaseModel, Field  # noqa: F401


def create_app() -> FastAPI:
    raise NotImplementedError
    app = FastAPI(title="Tasks API")

    @app.get("/health")
    def health():
        return {"status": "ok"}

    # ... твои модели и эндпоинты ...

    return app


# для `fastapi dev` / `uvicorn app:app`
try:
    app = create_app()
except NotImplementedError:
    app = FastAPI(title="Tasks API (ещё не реализовано)")
