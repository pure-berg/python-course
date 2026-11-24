# Входной тест — вопросы

Пиши ответ под каждым вопросом. Код **не запускай**. Не знаешь — пиши «не знаю».

## A. Основы

**1.** Что выведет?
```python
print(7 // 2, 7 % 2, 7 / 2, 2 ** 3)
```
Ответ:

**2.** Что выведет?
```python
s = "Python"
print(s[1:4], s[-1], s[::-1])
```
Ответ:

**3.** Что выведет?
```python
print(bool(""), bool("0"), bool([]), bool(0.0), bool(None))
```
Ответ:

**4.** Что выведет?
```python
x = 10
if x > 5:
    print("A")
elif x > 8:
    print("B")
else:
    print("C")
```
Ответ:

**5.** Что выведет?
```python
for i in range(1, 10, 3):
    print(i, end=" ")
```
Ответ:

## B. Коллекции

**6.** Что выведет?
```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```
Ответ:

**7.** Чем отличаются `list`, `tuple`, `set`, `dict`? Что из них можно использовать как ключ словаря?
Ответ:

**8.** Что выведет?
```python
d = {"a": 1, "b": 2}
print(d.get("c", 0), len(d), list(d.items())[0])
```
Ответ:

**9.** Что выведет?
```python
print([x * x for x in range(6) if x % 2 == 0])
```
Ответ:

**10.** Что выведет?
```python
print(set([3, 1, 3, 2, 1]) & {1, 2, 5})
```
Ответ:

## C. Функции

**11.** Что выведет? (классическая ловушка)
```python
def add(item, box=[]):
    box.append(item)
    return box

add(1)
print(add(2))
```
Ответ:

**12.** Что такое `*args` и `**kwargs`? Что выведет `f(1, 2, z=3)`, если `def f(*args, **kwargs): print(args, kwargs)`?
Ответ:

**13.** Что выведет?
```python
nums = [5, 3, 8]
print(sorted(nums, reverse=True), nums)
nums.sort()
print(nums)
```
Ответ:

**14.** Что выведет?
```python
f = lambda x, y=2: x ** y
print(f(3), f(2, 5))
```
Ответ:

## D. Ошибки и файлы

**15.** Что выведет?
```python
try:
    print(int("abc"))
except ValueError:
    print("bad")
else:
    print("ok")
finally:
    print("end")
```
Ответ:

**16.** Зачем писать `with open("file.txt") as f:` вместо просто `f = open("file.txt")`?
Ответ:

## E. ООП

**17.** Что выведет?
```python
class Dog:
    sound = "Гав"
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name}: {self.sound}"

class Puppy(Dog):
    sound = "Тяф"

print(Puppy("Бим").speak())
```
Ответ:

**18.** Что такое `self`? Что делает `__init__`? Что делает `__str__`?
Ответ:

**19.** Чем `@staticmethod` отличается от `@classmethod`?
Ответ:

## F. Продвинутое и инструменты

**20.** Что выведет?
```python
def gen():
    yield 1
    yield 2

g = gen()
print(next(g), list(g), list(g))
```
Ответ:

**21.** Что такое декоратор? Напиши словами, что произойдёт при вызове `hello()`:
```python
def loud(func):
    def wrapper():
        return func().upper()
    return wrapper

@loud
def hello():
    return "привет"
```
Ответ:

**22.** Чем `is` отличается от `==`?
Ответ:

**23.** Git: что делают `git add`, `git commit`, `git push`? Что такое ветка?
Ответ:

**24.** SQL: напиши запрос, который вернёт имена пользователей старше 18 из таблицы `users(id, name, age)`, отсортированные по имени.
Ответ:

**25.** Что такое HTTP-методы GET и POST, и что значат коды ответа 200, 404, 500?
Ответ:
