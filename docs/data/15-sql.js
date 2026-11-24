(() => {
// Общая учебная база для вопросов: users и orders (SQLite в памяти).
const DB = `import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER, amount INTEGER);
INSERT INTO users VALUES (1, 'Аня', 'Тирана'), (2, 'Боб', 'Рим'), (3, 'Вика', 'Тирана');
INSERT INTO orders VALUES (1, 1, 100), (2, 1, 300), (3, 2, 50);
""")`;
const sql = query => `${DB}\nprint(db.execute("""${query}""").fetchall())`;

MODULES.push({
  id: 15, week: 5, title: "SQL и базы данных",
  ai: "короткую программу на Python с sqlite3: создание двух связанных таблиц (users и orders), вставка через параметры ?, и 4–5 запросов SELECT с WHERE, ORDER BY, GROUP BY + COUNT/SUM, HAVING и LEFT JOIN",
  theory: `
**Реляционная БД** — таблицы со строками (записями) и столбцами. У каждой строки **первичный ключ** (\`id\`). Связи — через **внешний ключ**: \`orders.user_id\` → \`users.id\`.

    SELECT name, city FROM users
    WHERE city = 'Тирана' AND name LIKE 'А%'
    ORDER BY name DESC
    LIMIT 10 OFFSET 20;          -- пагинация: 3-я страница по 10

    INSERT INTO users (name, city) VALUES ('Гена', 'Рим');
    UPDATE users SET city = 'Рим' WHERE id = 3;   -- без WHERE изменит ВСЕ строки!
    DELETE FROM users WHERE id = 3;               -- и тут тоже

**Агрегаты:** \`COUNT(*)\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`. \`GROUP BY\` — посчитать по группам. \`WHERE\` фильтрует строки **до** группировки, \`HAVING\` — группы **после**.

    SELECT city, COUNT(*) FROM users GROUP BY city HAVING COUNT(*) > 1;

**JOIN** объединяет таблицы:

    SELECT u.name, o.amount
    FROM users u
    JOIN orders o ON o.user_id = u.id;       -- INNER: только пары, где есть совпадение
    -- LEFT JOIN: все users, даже без заказов (поля заказа = NULL)

**NULL** — «нет значения». Сравнение \`= NULL\` никогда не истинно, нужно \`IS NULL\` / \`IS NOT NULL\`.

**Индекс** (\`CREATE INDEX ... ON users(email)\`) ускоряет поиск по столбцу, но чуть замедляет запись.

**Из Python — только параметры, никогда f-строки** (иначе SQL-инъекция):

    db.execute("SELECT * FROM users WHERE name = ?", (name,))   # sqlite3
    # в psycopg/PostgreSQL плейсхолдер — %s, в SQLAlchemy — :name

**Транзакция** — несколько изменений «всё или ничего» (\`commit\` / \`rollback\`).
`,
  questions: [
    { run: true, q: "В базе users: Аня (Тирана), Боб (Рим), Вика (Тирана). Что выведет код?",
      code: sql("SELECT name FROM users WHERE city = 'Тирана' ORDER BY name DESC"),
      a: ["[('Вика',), ('Аня',)]", "[('Аня',), ('Вика',)]", "['Вика', 'Аня']", "[('Вика', 'Тирана'), ('Аня', 'Тирана')]"],
      e: "WHERE оставил двоих из Тираны, ORDER BY name DESC — по убыванию (В после А). `fetchall()` возвращает список кортежей — даже если столбец один, отсюда `('Вика',)`." },
    { run: true, q: "Что выведет код?",
      code: sql("SELECT city, COUNT(*) FROM users GROUP BY city ORDER BY city"),
      a: ["[('Рим', 1), ('Тирана', 2)]", "[('Тирана', 2), ('Рим', 1)]", "[(3,)]", "[('Рим', 1), ('Тирана', 1), ('Тирана', 1)]"],
      e: "GROUP BY city схлопывает строки с одинаковым городом в одну группу, COUNT(*) считает строки в группе. ORDER BY city — по алфавиту: Р раньше Т." },
    { run: true, q: "Заказы: у Ани 2 (100 и 300), у Боба 1 (50), у Вики нет. Что выведет код?",
      code: sql(`SELECT u.name, COUNT(o.id)
FROM users u LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id ORDER BY u.id`),
      a: ["[('Аня', 2), ('Боб', 1), ('Вика', 0)]", "[('Аня', 2), ('Боб', 1)]", "[('Аня', 1), ('Боб', 1), ('Вика', 1)]", "[('Аня', 3), ('Боб', 3), ('Вика', 3)]"],
      e: "LEFT JOIN сохраняет всех пользователей; у Вики поля заказа — NULL. `COUNT(o.id)` не считает NULL, поэтому 0. С `COUNT(*)` у Вики получилось бы 1 — частая ошибка." },
    { run: true, q: "Что выведет код (обычный JOIN)?",
      code: sql(`SELECT u.name, o.amount FROM users u
JOIN orders o ON o.user_id = u.id ORDER BY o.amount`),
      a: ["[('Боб', 50), ('Аня', 100), ('Аня', 300)]", "[('Аня', 100), ('Аня', 300), ('Боб', 50), ('Вика', None)]", "[('Аня', 400), ('Боб', 50)]", "[('Боб', 50), ('Аня', 100)]"],
      e: "INNER JOIN оставляет только совпавшие пары: Вики нет. Строк столько, сколько заказов — Аня встречается дважды. Суммы без GROUP BY не складываются." },
    { lang: "sql", q: "Что сделает этот запрос?", code: `UPDATE users SET city = 'Рим';`,
      a: ["Поменяет город у ВСЕХ пользователей", "Ничего: без WHERE запрос не выполнится", "Поменяет город у первого пользователя", "Добавит нового пользователя из Рима"],
      e: "Без WHERE UPDATE и DELETE затрагивают всю таблицу. Это классическая авария на проде. Перед UPDATE/DELETE полезно выполнить SELECT с тем же WHERE и посмотреть, что попадёт." },
    { run: true, q: "Что выведет код?", code: `import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE t (x INTEGER);
INSERT INTO t VALUES (1), (NULL);
""")
a = db.execute("SELECT COUNT(*) FROM t WHERE x = NULL").fetchone()[0]
b = db.execute("SELECT COUNT(*) FROM t WHERE x IS NULL").fetchone()[0]
print(a, b)`,
      a: ["0 1", "1 1", "1 0", "0 0"],
      e: "NULL — «неизвестно». `x = NULL` даёт не True, а NULL, и строка не проходит. Для проверки — только `IS NULL`. `fetchone()[0]` — первое поле первой строки." },
    { q: "Что опасного в этом коде, который написал ИИ?", code: `
def find_user(db, name):
    return db.execute(f"SELECT * FROM users WHERE name = '{name}'").fetchall()`,
      a: ["SQL-инъекция: если name = `' OR '1'='1`, вернутся все пользователи (или хуже)", "f-строки медленнее параметров", "fetchall нельзя использовать в функции", "Ничего, код безопасен"],
      e: "Пользовательский ввод вклеивается прямо в SQL и становится частью запроса. Правильно: `db.execute(\"SELECT * FROM users WHERE name = ?\", (name,))` — драйвер передаёт значение отдельно от запроса." },
    { run: true, q: "Что выведет код?",
      code: sql("SELECT city FROM users GROUP BY city HAVING COUNT(*) > 1"),
      a: ["[('Тирана',)]", "[('Рим',), ('Тирана',)]", "[('Рим',)]", "[]"],
      e: "HAVING фильтрует уже сгруппированные строки по агрегату. В Тиране 2 пользователя, в Риме 1. В WHERE написать `COUNT(*) > 1` нельзя — он работает до группировки." },
    { run: true, q: "Что выведет код?",
      code: sql("SELECT SUM(amount), MAX(amount), COUNT(DISTINCT user_id) FROM orders"),
      a: ["[(450, 300, 2)]", "[(450, 300, 3)]", "[(400, 300, 2)]", "[(450,), (300,), (2,)]"],
      e: "Сумма 100+300+50 = 450, максимум 300. `COUNT(DISTINCT user_id)` — сколько РАЗНЫХ покупателей: Аня и Боб — 2. Без GROUP BY агрегаты считаются по всей таблице — одна строка." },
    { q: "Зачем `CREATE INDEX idx_users_email ON users(email);`?",
      a: ["Чтобы поиск `WHERE email = ...` не перебирал всю таблицу", "Чтобы email стал уникальным", "Чтобы email нельзя было изменить", "Чтобы таблица заняла меньше места"],
      e: "Индекс — как алфавитный указатель в книге: поиск за O(log n) вместо полного перебора. Цена — место и чуть более медленные INSERT/UPDATE. Уникальность — это `UNIQUE`, отдельная вещь." },
    { q: "Перевод денег: списать у Ани и зачислить Бобу. Почему это делают в одной транзакции?",
      a: ["Если второй шаг упадёт, первый откатится — деньги не пропадут", "Так запросы выполняются быстрее", "Без транзакции нельзя делать UPDATE", "Чтобы другие пользователи не видели таблицу"],
      e: "Транзакция — «всё или ничего» (atomicity из ACID). Без неё сбой между двумя UPDATE оставит базу в неверном состоянии: у Ани списали, Бобу не пришло." },
  ],
});
})();
