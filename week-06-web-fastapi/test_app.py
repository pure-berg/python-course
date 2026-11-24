import pytest
from fastapi.testclient import TestClient

import app as app_module


@pytest.fixture
def client():
    return TestClient(app_module.create_app())


def make(client, **data):
    data.setdefault("title", "Задача")
    r = client.post("/tasks", json=data)
    assert r.status_code == 201, r.text
    return r.json()


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200 and r.json() == {"status": "ok"}


def test_create_defaults(client):
    r = client.post("/tasks", json={"title": "Купить молоко"})
    assert r.status_code == 201
    assert r.json() == {
        "id": 1,
        "title": "Купить молоко",
        "description": None,
        "priority": 3,
        "done": False,
    }


def test_create_full(client):
    t = make(client, title="Код", description="ревью", priority=5)
    assert (t["description"], t["priority"]) == ("ревью", 5)


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"title": ""},
        {"title": "x" * 201},
        {"title": "ok", "priority": 0},
        {"title": "ok", "priority": 6},
        {"title": "ok", "priority": "high"},
    ],
)
def test_create_validation(client, body):
    assert client.post("/tasks", json=body).status_code == 422


def test_list_and_get(client):
    assert client.get("/tasks").json() == []
    a, b = make(client, title="A"), make(client, title="B")
    assert [t["title"] for t in client.get("/tasks").json()] == ["A", "B"]
    assert client.get(f"/tasks/{b['id']}").json() == b
    assert a["id"] != b["id"]


def test_get_404(client):
    r = client.get("/tasks/999")
    assert r.status_code == 404
    assert r.json() == {"detail": "Task not found"}


def test_patch(client):
    t = make(client, title="Старое", description="d")
    r = client.patch(f"/tasks/{t['id']}", json={"done": True, "priority": 1})
    assert r.status_code == 200
    body = r.json()
    assert body["done"] is True and body["priority"] == 1
    assert body["title"] == "Старое" and body["description"] == "d", "PATCH затёр поля, которых не было в запросе"
    assert client.get(f"/tasks/{t['id']}").json() == body


def test_patch_errors(client):
    assert client.patch("/tasks/1", json={"done": True}).status_code == 404
    t = make(client)
    assert client.patch(f"/tasks/{t['id']}", json={"priority": 10}).status_code == 422
    assert client.patch(f"/tasks/{t['id']}", json={"title": ""}).status_code == 422


def test_filter_done(client):
    a, b, c = make(client, title="a"), make(client, title="b"), make(client, title="c")
    client.patch(f"/tasks/{b['id']}", json={"done": True})
    assert [t["title"] for t in client.get("/tasks", params={"done": "true"}).json()] == ["b"]
    assert [t["title"] for t in client.get("/tasks", params={"done": "false"}).json()] == ["a", "c"]


def test_delete(client):
    a, b = make(client, title="a"), make(client, title="b")
    r = client.delete(f"/tasks/{a['id']}")
    assert r.status_code == 204 and r.content == b""
    assert client.get(f"/tasks/{a['id']}").status_code == 404
    assert client.delete(f"/tasks/{a['id']}").status_code == 404
    c = make(client, title="c")
    assert c["id"] not in (a["id"], b["id"]), "id не должны переиспользоваться"


def test_apps_are_isolated():
    one = TestClient(app_module.create_app())
    one.post("/tasks", json={"title": "x"})
    two = TestClient(app_module.create_app())
    assert two.get("/tasks").json() == []
