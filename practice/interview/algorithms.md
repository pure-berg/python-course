# Алгоритмы и live coding

## Что знать
- ⭐ O-нотация; оценить сложность своего решения по времени и памяти.
- ⭐ Сложность операций `list`, `dict`, `set`, `deque`.
- Сортировки: идея quicksort и mergesort, почему O(n log n), что использует `sorted()` (Timsort, стабильная).
- ⭐ Бинарный поиск.
- ⭐ Техники: хеш-таблица, два указателя, скользящее окно, стек, префиксные суммы.
- Рекурсия, BFS/DFS на графе/дереве (базово), связный список (развернуть).

## Как решать на собеседовании
1. Перескажи задачу своими словами, уточни входные данные и граничные случаи (пусто? отрицательные? дубликаты?).
2. Предложи простое решение, назови сложность.
3. Предложи оптимизацию, обсуди с интервьюером, потом пиши код.
4. Пиши **вслух**, понятные имена переменных.
5. Прогони руками на примере и на граничном случае.

## Минимальный набор (LeetCode, ≈ 40 задач)
Из [NeetCode 150](https://neetcode.io/practice) — разделы:
- Arrays & Hashing — все Easy + 3–4 Medium (Two Sum, Valid Anagram, Group Anagrams, Top K Frequent, Product of Array Except Self, Longest Consecutive Sequence);
- Two Pointers — Valid Palindrome, Two Sum II, 3Sum, Container With Most Water;
- Sliding Window — Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters;
- Stack — Valid Parentheses, Min Stack, Daily Temperatures;
- Binary Search — Binary Search, Search in Rotated Sorted Array;
- Linked List — Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle;
- Trees — Invert Binary Tree, Maximum Depth, Same Tree.

Задачи, уже решённые на неделе 4, засчитываются — перерешай их на LeetCode с нуля.

## Типовые задачи от российских компаний на джуна
- развернуть строку / проверить палиндром;
- найти дубликаты в списке;
- FizzBuzz;
- сгруппировать анаграммы;
- проверить скобки;
- сжать строку (RLE);
- слить два отсортированных списка / пересечение двух массивов;
- написать декоратор (таймер, retry, кеш);
- написать генератор (чанки, Фибоначчи);
- спроектировать класс (стек, очередь, LRU-кеш).
