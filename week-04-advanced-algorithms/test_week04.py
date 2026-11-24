import itertools
import random

import pytest

import week04 as w


def test_fib():
    assert list(itertools.islice(w.fib(), 10)) == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]


def test_chunked():
    assert list(w.chunked(range(5), 2)) == [[0, 1], [2, 3], [4]]
    assert list(w.chunked([], 3)) == []
    infinite = itertools.count()
    assert next(iter(w.chunked(infinite, 3))) == [0, 1, 2]


def test_countdown():
    c = w.Countdown(3)
    assert list(c) == [3, 2, 1]
    assert list(c) == [3, 2, 1], "второй проход должен работать"
    assert list(w.Countdown(0)) == []


def test_count_calls():
    @w.count_calls
    def greet(name):
        """Приветствие."""
        return f"hi {name}"

    assert greet.calls == 0
    assert greet("a") == "hi a"
    greet("b")
    assert greet.calls == 2
    assert greet.__name__ == "greet" and greet.__doc__ == "Приветствие."


def test_memoize():
    calls = []

    @w.memoize
    def slow_square(x):
        calls.append(x)
        return x * x

    assert [slow_square(3), slow_square(3), slow_square(4)] == [9, 9, 16]
    assert calls == [3, 4]

    @w.memoize
    def fibo(n):
        return n if n < 2 else fibo(n - 1) + fibo(n - 2)

    assert fibo(200) == 280571172992510140037611932413038677189525


def test_suppress():
    with w.suppress(KeyError, IndexError):
        {}["x"]
    with w.suppress(KeyError):
        pass
    with pytest.raises(ZeroDivisionError):
        with w.suppress(KeyError):
            1 / 0


def test_binary_search():
    nums = [1, 3, 5, 7, 9, 11]
    for i, x in enumerate(nums):
        assert w.binary_search(nums, x) == i
    assert w.binary_search(nums, 4) == -1
    assert w.binary_search([], 1) == -1
    big = list(range(0, 2_000_000, 2))
    assert w.binary_search(big, 1_999_998) == 999_999


def test_two_sum():
    assert w.two_sum([2, 7, 11, 15], 9) == (0, 1)
    assert w.two_sum([3, 2, 4], 6) == (1, 2)
    assert w.two_sum([3, 3], 6) == (0, 1)
    assert w.two_sum([1, 2], 10) is None


def test_two_sum_is_fast():
    import time

    nums = list(range(20_000))
    start = time.perf_counter()
    assert w.two_sum(nums, 39_997) == (19_998, 19_999)
    assert time.perf_counter() - start < 0.5, "слишком медленно: нужен O(n) через словарь"


def test_valid_brackets():
    assert w.valid_brackets("f(a[1]) { }")
    assert w.valid_brackets("")
    assert not w.valid_brackets("(]")
    assert not w.valid_brackets("([)]")
    assert not w.valid_brackets("((")
    assert not w.valid_brackets(")(")


def test_merge_sorted():
    assert w.merge_sorted([1, 4, 9], [2, 3, 10, 11]) == [1, 2, 3, 4, 9, 10, 11]
    assert w.merge_sorted([], [1]) == [1]
    a = sorted(random.sample(range(1000), 50))
    b = sorted(random.sample(range(1000), 70))
    assert w.merge_sorted(a, b) == sorted(a + b)


def test_group_anagrams():
    assert w.group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]) == [
        ["eat", "tea", "ate"],
        ["tan", "nat"],
        ["bat"],
    ]
    assert w.group_anagrams([]) == []


def test_top_k_frequent():
    assert w.top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]
    assert w.top_k_frequent([5, 4, 4, 5, 3], 2) == [4, 5]


def test_max_subarray():
    assert w.max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert w.max_subarray([-3, -1, -2]) == -1
    assert w.max_subarray([5]) == 5


def test_rle_encode():
    assert w.rle_encode("aaabccdddd") == "a3bc2d4"
    assert w.rle_encode("") == ""
    assert w.rle_encode("abc") == "abc"


def test_longest_unique_substring():
    assert w.longest_unique_substring("abcabcbb") == 3
    assert w.longest_unique_substring("bbbbb") == 1
    assert w.longest_unique_substring("pwwkew") == 3
    assert w.longest_unique_substring("") == 0
    assert w.longest_unique_substring("abba") == 2
