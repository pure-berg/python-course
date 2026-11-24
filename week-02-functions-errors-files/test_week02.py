import json

import pytest

import week02 as w


def test_apply_n_times():
    assert w.apply_n_times(lambda v: v * 2, 3, 1) == 8
    assert w.apply_n_times(str.upper, 0, "a") == "a"


def test_compose():
    assert w.compose(str, abs)(-5) == "5"
    assert w.compose()(7) == 7
    assert w.compose(lambda x: x + 1, lambda x: x * 10)(2) == 21


def test_make_counter():
    c1, c2 = w.make_counter(10), w.make_counter()
    assert (c1(), c1(), c1()) == (10, 11, 12)
    assert (c2(), c2()) == (0, 1)


def test_to_query():
    assert w.to_query(page=2, q="python", sort=None) == "page=2&q=python"
    assert w.to_query() == ""
    assert w.to_query(b=1, a=0) == "a=0&b=1"


def test_safe_int():
    assert w.safe_int("42") == 42
    assert w.safe_int("abc", 0) == 0
    assert w.safe_int(None) is None
    assert w.safe_int(3.9) == 3


def test_parse_kv():
    assert w.parse_kv(" host = example.com ") == ("host", "example.com")
    assert w.parse_kv("url=a=b") == ("url", "a=b")
    assert w.parse_kv("empty=") == ("empty", "")
    for bad in ["novalue", "=x", "  = 1"]:
        with pytest.raises(ValueError):
            w.parse_kv(bad)


def test_withdraw():
    assert w.withdraw(100, 30) == 70
    with pytest.raises(w.InsufficientFunds):
        w.withdraw(10, 30)
    with pytest.raises(ValueError):
        w.withdraw(10, 0)
    assert issubclass(w.InsufficientFunds, Exception)


def test_retry_eventually_succeeds():
    calls = []

    def flaky():
        calls.append(1)
        if len(calls) < 3:
            raise ConnectionError("нет сети")
        return "ok"

    assert w.retry(flaky, 5) == "ok"
    assert len(calls) == 3


def test_retry_gives_up():
    calls = []

    def broken():
        calls.append(1)
        raise TimeoutError(f"попытка {len(calls)}")

    with pytest.raises(TimeoutError, match="попытка 3"):
        w.retry(broken, 3)
    assert len(calls) == 3


def test_read_numbers(tmp_path):
    f = tmp_path / "n.txt"
    f.write_text("1\n\n# комментарий\n  2.5 \n-3\n", encoding="utf-8")
    assert w.read_numbers(f) == [1.0, 2.5, -3.0]


def test_top_words(tmp_path):
    f = tmp_path / "t.txt"
    f.write_text("Кот и пёс. Кот, кот! И пёс? Ёж 42", encoding="utf-8")
    assert w.top_words(f, 3) == [("кот", 3), ("и", 2), ("пёс", 2)]


def test_write_csv(tmp_path):
    import csv

    f = tmp_path / "r.csv"
    rows = [{"name": "Аня", "age": 30}, {"name": "Боб", "age": 25}]
    w.write_csv(rows, f)
    with open(f, encoding="utf-8", newline="") as fh:
        back = list(csv.DictReader(fh))
    assert back == [{"name": "Аня", "age": "30"}, {"name": "Боб", "age": "25"}]

    empty = tmp_path / "e.csv"
    w.write_csv([], empty)
    assert empty.exists() and empty.read_text() == ""


def test_load_config(tmp_path):
    defaults = {"debug": False, "port": 8000}
    f = tmp_path / "c.json"
    f.write_text(json.dumps({"port": 9000, "name": "app"}), encoding="utf-8")
    assert w.load_config(f, defaults) == {"debug": False, "port": 9000, "name": "app"}
    assert defaults == {"debug": False, "port": 8000}, "defaults изменились"

    missing = w.load_config(tmp_path / "nope.json", defaults)
    assert missing == defaults and missing is not defaults

    bad = tmp_path / "bad.json"
    bad.write_text("{oops", encoding="utf-8")
    with pytest.raises(ValueError):
        w.load_config(bad, defaults)
