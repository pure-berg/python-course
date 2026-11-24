(() => {
const HEAD = `from sqlalchemy import create_engine, select, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    age: Mapped[int | None]
    orders: Mapped[list["Order"]] = relationship(back_populates="user")

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[int]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped[User] = relationship(back_populates="orders")

engine = create_engine("sqlite://")
Base.metadata.create_all(engine)
`;

MODULES.push({
  id: 18, week: 6, title: "SQLAlchemy и ORM",
  ai: "короткий пример на SQLAlchemy 2.0: две модели (User и Order) с Mapped/mapped_column и relationship, создание сессии, добавление записей, запросы select() с where/order_by, и зависимость get_db с yield для FastAPI",
  theory: `
**ORM** (Object-Relational Mapping) — классы Python ↔ таблицы, объекты ↔ строки. Пишешь \`session.add(user)\` вместо INSERT. SQLAlchemy — главная ORM в Python (стиль 2.0):

    from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

    class Base(DeclarativeBase): pass

    class User(Base):
        __tablename__ = "users"
        id: Mapped[int] = mapped_column(primary_key=True)
        email: Mapped[str] = mapped_column(unique=True, index=True)
        age: Mapped[int | None]                     # | None → столбец может быть NULL
        orders: Mapped[list["Order"]] = relationship(back_populates="user")

**Сессия** — «единица работы»: копит изменения и отправляет их в БД транзакцией.

    with Session(engine) as session:
        user = User(email="a@b.c")
        session.add(user)
        session.commit()                 # без commit изменения не сохранятся
        session.refresh(user)            # перечитать из БД (появится id и т.п.)

        session.get(User, 1)             # по первичному ключу, None если нет
        stmt = select(User).where(User.age > 18).order_by(User.email)
        users = session.scalars(stmt).all()   # список объектов User

**N+1 проблема:** загрузили 100 пользователей (1 запрос), потом в цикле обратились к \`user.orders\` — ещё 100 запросов. Решение: \`select(User).options(selectinload(User.orders))\`.

**Миграции** (Alembic) — версии схемы БД: \`alembic revision --autogenerate\`, \`alembic upgrade head\`. Таблицы на проде меняют миграциями, а не \`create_all\`.

**В FastAPI** сессия создаётся на каждый запрос через зависимость:

    def get_db():
        with Session(engine) as session:
            yield session          # после ответа сессия закроется
`,
  questions: [
    { q: "Что такое ORM?",
      a: ["Способ работать с таблицами БД как с классами и объектами Python", "Отдельная база данных, быстрее PostgreSQL", "Язык запросов вместо SQL", "Библиотека для миграций"],
      e: "ORM генерирует SQL за тебя: класс User ↔ таблица users, объект ↔ строка, атрибут ↔ столбец. SQL при этом никуда не девается — его полезно уметь читать (`echo=True` покажет запросы)." },
    { run: true, q: "Что выведет код?", code: HEAD + `
with Session(engine) as s:
    s.add_all([User(name="Аня", age=30), User(name="Боб", age=17)])
    s.commit()
    adults = s.scalars(select(User).where(User.age >= 18)).all()
    print([u.name for u in adults])`,
      a: ["['Аня']", "['Аня', 'Боб']", "[<User object>]", "[]"],
      e: "`select(User).where(User.age >= 18)` превращается в `SELECT ... WHERE age >= 18`. `scalars(...).all()` возвращает список объектов User, у них берём `.name`." },
    { run: true, q: "Что выведет код?", code: HEAD + `
with Session(engine) as s:
    u = User(name="Аня")
    print(u.id)
    s.add(u)
    s.commit()
    print(u.id)`,
      a: ["None\n1", "1\n1", "None\nNone", "0\n1"],
      e: "Пока объект не сохранён, id нет — его выдаёт база при INSERT. После `commit()` SQLAlchemy знает id. Поэтому после создания объект часто возвращают клиенту уже с id." },
    { q: "Что будет с изменениями, если забыть `session.commit()`?", code: `
with Session(engine) as session:
    user = session.get(User, 1)
    user.name = "Новое имя"`,
      a: ["Они не сохранятся: при закрытии сессии транзакция откатится", "Сохранятся автоматически при выходе из with", "Сохранятся при следующем запуске программы", "Python выдаст ошибку"],
      e: "Сессия копит изменения в транзакции. Без commit при закрытии будет rollback. Тихий баг: код работает без ошибок, но данные не меняются." },
    { run: true, q: "Что выведет код?", code: HEAD + `
with Session(engine) as s:
    print(s.get(User, 999))`,
      a: ["None", "Ошибка: запись не найдена", "User(id=999)", "[]"],
      e: "`session.get` ищет по первичному ключу и возвращает None, если записи нет. В обработчике FastAPI после этого обычно `raise HTTPException(404)`." },
    { run: true, q: "Что выведет код?", code: HEAD + `
with Session(engine) as s:
    anya = User(name="Аня")
    anya.orders.append(Order(amount=100))
    anya.orders.append(Order(amount=300))
    s.add(anya)
    s.commit()
    order = s.scalars(select(Order).where(Order.amount == 300)).one()
    print(order.user.name, len(order.user.orders))`,
      a: ["Аня 2", "Аня 1", "None 0", "Ошибка: заказы не сохранены"],
      e: "relationship связывает объекты: добавили заказы в `anya.orders` — при commit они сохранились с её user_id. `order.user` идёт обратно к владельцу (back_populates)." },
    { q: "Сколько SQL-запросов выполнит этот код для 100 пользователей (без особых настроек)?", code: `
users = session.scalars(select(User)).all()
for u in users:
    print(u.name, len(u.orders))`,
      a: ["101: один за пользователями и по одному за заказами каждого", "1", "2", "100"],
      e: "Это N+1: связи по умолчанию грузятся лениво — при первом обращении. Лечится жадной загрузкой: `select(User).options(selectinload(User.orders))` — всего 2 запроса." },
    { q: "Зачем в проекте Alembic?",
      a: ["Чтобы версионировать изменения схемы БД миграциями и применять их на всех окружениях", "Чтобы ускорить запросы", "Это драйвер PostgreSQL", "Для тестирования моделей"],
      e: "Добавил поле в модель — нужна миграция (ALTER TABLE), иначе в рабочей базе столбца не будет. `create_all` не изменяет уже существующие таблицы." },
    { q: "Зачем в зависимости FastAPI `yield`, а не `return`?", code: `
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()`,
      a: ["Код после yield выполнится после ответа — сессия гарантированно закроется", "yield делает запрос асинхронным", "return нельзя использовать в FastAPI", "Чтобы сессия была общей для всех запросов"],
      e: "Зависимость с yield работает как контекстный менеджер: до yield — подготовка, после — очистка, даже если обработчик упал. Каждый запрос получает свою сессию." },
    { q: "Что означает `age: Mapped[int | None]` в модели?",
      a: ["Столбец age целочисленный и может быть NULL", "age — список целых чисел", "age по умолчанию 0", "age — первичный ключ"],
      e: "В SQLAlchemy 2.0 аннотация задаёт и тип столбца, и nullable. `Mapped[int]` — NOT NULL, `Mapped[int | None]` — можно NULL." },
    { q: "Какой SQL примерно сгенерирует этот запрос?", code: `select(User).where(User.age > 18).order_by(User.name).limit(10)`,
      a: ["SELECT ... FROM users WHERE age > 18 ORDER BY name LIMIT 10", "SELECT ... FROM users LIMIT 10 WHERE age > 18", "UPDATE users SET age = 18", "SELECT name FROM users ORDER BY age LIMIT 10"],
      e: "Методы select() почти один в один повторяют SQL. Увидеть точный запрос: `print(stmt)` или `create_engine(..., echo=True)`." },
  ],
});
})();
