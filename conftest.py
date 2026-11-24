"""Общие настройки автопроверки.

* Нерешённая задача (функция, которая всё ещё делает `raise NotImplementedError`)
  считается ПРОПУЩЕННОЙ, а не упавшей — поэтому CI зелёный, пока ты не начал задачу.
* В конце прогона печатается прогресс по каждому разделу курса.
"""
from collections import defaultdict
from pathlib import Path

import pytest

ROOT = Path(__file__).parent


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if (
        call.when in ("setup", "call")
        and call.excinfo is not None
        and call.excinfo.errisinstance(NotImplementedError)
    ):
        rep.outcome = "skipped"
        rep.longrepr = (str(item.path), item.location[1] or 0, "задача ещё не решена")


def _section(report) -> str:
    path = Path(report.fspath) if hasattr(report, "fspath") else None
    try:
        return path.resolve().relative_to(ROOT).parts[0]
    except Exception:
        return "?"


def pytest_terminal_summary(terminalreporter):
    stats = defaultdict(lambda: {"passed": 0, "failed": 0, "skipped": 0})
    for key in ("passed", "failed", "skipped", "error"):
        for rep in terminalreporter.stats.get(key, []):
            if getattr(rep, "when", "call") not in ("call", "setup"):
                continue
            if key == "passed" and rep.when != "call":
                continue
            bucket = "failed" if key == "error" else key
            stats[_section(rep)][bucket] += 1
    if not stats:
        return
    tr = terminalreporter
    tr.section("Прогресс по курсу")
    for section in sorted(stats):
        s = stats[section]
        total = s["passed"] + s["failed"] + s["skipped"]
        done = s["passed"]
        bar = "█" * round(10 * done / total) + "░" * (10 - round(10 * done / total))
        tr.write_line(
            f"{section:<34} {bar} {done:>3}/{total:<3}"
            f"  ✗ ошибок: {s['failed']:<3} … не начато: {s['skipped']}"
        )
