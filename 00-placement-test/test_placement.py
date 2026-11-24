import pytest

import placement as p


def test_1_sum_of_evens():
    assert p.sum_of_evens([1, 2, 3, 4, -6]) == 0
    assert p.sum_of_evens([2, 4, 5]) == 6
    assert p.sum_of_evens([]) == 0
    assert p.sum_of_evens([1, 3]) == 0


def test_2_count_vowels():
    assert p.count_vowels("Hello, Мир!") == 3
    assert p.count_vowels("AEIOU аЕёИоУыЭюЯ") == 15
    assert p.count_vowels("xyz бвг 123") == 0
    assert p.count_vowels("") == 0


def test_3_longest_word():
    assert p.longest_word("я люблю программировать на питоне") == "программировать"
    assert p.longest_word("aa bb c") == "aa"
    assert p.longest_word("") == ""
    assert p.longest_word("одно") == "одно"


def test_4_char_frequency():
    assert p.char_frequency("abca") == {"a": 2, "b": 1, "c": 1}
    assert p.char_frequency("") == {}
    assert p.char_frequency("aa  ") == {"a": 2, " ": 2}


def test_5_remove_duplicates():
    assert p.remove_duplicates([3, 1, 3, 2, 1]) == [3, 1, 2]
    assert p.remove_duplicates([]) == []
    assert p.remove_duplicates(["b", "a", "b"]) == ["b", "a"]


def test_6_invert_dict():
    assert p.invert_dict({"a": 1, "b": 2, "c": 1}) == {1: ["a", "c"], 2: ["b"]}
    assert p.invert_dict({}) == {}


def test_7_shopping_cart():
    cart = p.ShoppingCart()
    assert cart.total() == 0
    cart.add("хлеб", 50)
    cart.add("молоко", 90, qty=2)
    cart.add("хлеб", 50)
    assert cart.total() == 280
    assert cart.items_count() == 4
    cart.remove("молоко")
    assert cart.total() == 100
    assert cart.items_count() == 2
    with pytest.raises(KeyError):
        cart.remove("сыр")
    with pytest.raises(ValueError):
        cart.add("x", -1)
    with pytest.raises(ValueError):
        cart.add("x", 10, qty=0)


def test_7_carts_are_independent():
    a, b = p.ShoppingCart(), p.ShoppingCart()
    a.add("x", 10)
    assert b.total() == 0


def test_8_flatten_deep():
    assert p.flatten_deep([1, [2, [3, [4]], 5], [], 6]) == [1, 2, 3, 4, 5, 6]
    assert p.flatten_deep([]) == []
    assert p.flatten_deep([[[[]]]]) == []
    assert p.flatten_deep(["ab", ["cd"]]) == ["ab", "cd"]
