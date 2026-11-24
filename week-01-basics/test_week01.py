import week01 as w


def test_fizzbuzz():
    assert w.fizzbuzz(5) == ["1", "2", "Fizz", "4", "Buzz"]
    assert w.fizzbuzz(15)[-1] == "FizzBuzz"
    assert w.fizzbuzz(0) == []
    assert len(w.fizzbuzz(100)) == 100


def test_is_palindrome():
    assert w.is_palindrome("А роза упала на лапу Азора")
    assert w.is_palindrome("A man, a plan, a canal: Panama")
    assert w.is_palindrome("")
    assert not w.is_palindrome("python")
    assert w.is_palindrome("12321")


def test_caesar():
    assert w.caesar("Hello, World!", 3) == "Khoor, Zruog!"
    assert w.caesar("xyz", 3) == "abc"
    assert w.caesar("abc", -3) == "xyz"
    assert w.caesar("abc", 29) == "def"
    assert w.caesar("Привет 123", 5) == "Привет 123"
    assert w.caesar(w.caesar("Round Trip", 11), -11) == "Round Trip"


def test_second_largest():
    assert w.second_largest([4, 1, 4, 3]) == 3
    assert w.second_largest([7, 7]) is None
    assert w.second_largest([]) is None
    assert w.second_largest([-1, -5]) == -5


def test_chunks():
    assert w.chunks([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]]
    assert w.chunks([], 3) == []
    assert w.chunks([1, 2], 5) == [[1, 2]]


def test_flatten():
    assert w.flatten([[1, 2], [3], []]) == [1, 2, 3]
    assert w.flatten([]) == []
    assert w.flatten([[[1]], [2]]) == [[1], 2]


def test_running_sum():
    assert w.running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]
    assert w.running_sum([]) == []
    assert w.running_sum([5, -5]) == [5, 0]


def test_count_words():
    assert w.count_words("Мама мыла раму. Раму мыла мама!") == {"мама": 2, "мыла": 2, "раму": 2}
    assert w.count_words("") == {}
    assert w.count_words("Hi,  hi?  HI") == {"hi": 3}


def test_group_by_first_letter():
    assert w.group_by_first_letter(["apple", "Avocado", "banana"]) == {
        "a": ["apple", "Avocado"],
        "b": ["banana"],
    }
    assert w.group_by_first_letter([]) == {}
    assert w.group_by_first_letter(["", "x"]) == {"x": ["x"]}


def test_merge_sum():
    a, b = {"x": 1, "y": 2}, {"y": 3, "z": 4}
    assert w.merge_sum(a, b) == {"x": 1, "y": 5, "z": 4}
    assert a == {"x": 1, "y": 2} and b == {"y": 3, "z": 4}, "исходные словари изменились"


def test_common_elements():
    assert w.common_elements([3, 1, 2, 2], [2, 3, 4]) == [2, 3]
    assert w.common_elements([1], [2]) == []


def test_most_common_char():
    assert w.most_common_char("abracadabra") == "a"
    assert w.most_common_char("") is None
    assert w.most_common_char("ab ba") == "a"
    assert w.most_common_char("   ") is None


def test_transpose():
    assert w.transpose([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]
    assert w.transpose([[1]]) == [[1]]
    assert w.transpose([]) == []


def test_roman_to_int():
    assert w.roman_to_int("III") == 3
    assert w.roman_to_int("IV") == 4
    assert w.roman_to_int("LVIII") == 58
    assert w.roman_to_int("MCMXCIV") == 1994
    assert w.roman_to_int("MMMCMXCIX") == 3999
