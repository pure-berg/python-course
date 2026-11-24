-- Учебная база интернет-магазина. Работает и в SQLite, и в PostgreSQL.
CREATE TABLE users (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL,
    city        TEXT NOT NULL,
    created_at  DATE NOT NULL
);

CREATE TABLE products (
    id        INTEGER PRIMARY KEY,
    title     TEXT NOT NULL,
    category  TEXT NOT NULL,
    price     INTEGER NOT NULL          -- в рублях
);

CREATE TABLE orders (
    id          INTEGER PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id),
    created_at  DATE NOT NULL,
    status      TEXT NOT NULL           -- new | paid | cancelled
);

CREATE TABLE order_items (
    order_id    INTEGER NOT NULL REFERENCES orders(id),
    product_id  INTEGER NOT NULL REFERENCES products(id),
    qty         INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

INSERT INTO users (id, name, city, created_at) VALUES
    (1, 'Аня',  'Москва', '2026-01-05'),
    (2, 'Боб',  'Казань', '2026-01-10'),
    (3, 'Вика', 'Москва', '2026-02-01'),
    (4, 'Гоша', 'СПб',    '2026-02-15'),
    (5, 'Даша', 'Казань', '2026-03-01'),
    (6, 'Егор', 'Москва', '2026-03-03');

INSERT INTO products (id, title, category, price) VALUES
    (1, 'Python для начинающих', 'books',       900),
    (2, 'Чистый код',            'books',       1200),
    (3, 'Грокаем алгоритмы',     'books',       800),
    (4, 'Клавиатура',            'electronics', 3500),
    (5, 'Мышь',                  'electronics', 1500),
    (6, 'Кружка',                'home',        400),
    (7, 'Наушники',              'electronics', 3500);

INSERT INTO orders (id, user_id, created_at, status) VALUES
    (1, 1, '2026-01-20', 'paid'),
    (2, 1, '2026-02-11', 'paid'),
    (3, 2, '2026-02-12', 'cancelled'),
    (4, 3, '2026-02-20', 'paid'),
    (5, 4, '2026-03-05', 'new'),
    (6, 3, '2026-03-10', 'paid');

INSERT INTO order_items (order_id, product_id, qty) VALUES
    (1, 1, 1), (1, 6, 2),
    (2, 4, 1),
    (3, 5, 2),
    (4, 2, 1), (4, 3, 1), (4, 6, 1),
    (5, 7, 1),
    (6, 5, 1), (6, 1, 2);
