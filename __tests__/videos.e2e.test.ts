import request from "supertest";
import { app } from "../src/app";
import { VideoType } from "../src/types";

describe("/api/videos", () => {

  it("GET /api/videos - should return array of videos", async () => {
    const res = await request(app).get("/api/videos").expect(200);

    // Проверяем, что ответ — массив
    expect(Array.isArray(res.body)).toBe(true);

    // Проверяем, что первый элемент имеет нужные поля
    if (res.body.length > 0) {
      const video: VideoType = res.body[0];
      expect(video).toHaveProperty("id");
      expect(video).toHaveProperty("title");
      expect(video).toHaveProperty("author");
      expect(video).toHaveProperty("availableResolutions");
    }
  });

  it("GET /api/videos/:id - should return video by ID (200)", async () => {
    // Сначала получаем список, чтобы узнать существующий id
    const list = await request(app).get("/api/videos").expect(200);
    const firstVideo: VideoType = list.body[0];

    const res = await request(app)
      .get(`/api/videos/${firstVideo.id}`)
      .expect(200)
      .expect("Content-Type", /json/);

    expect(res.body).toMatchObject({
      id: firstVideo.id,
      title: firstVideo.title,
      author: firstVideo.author,
    });
  });

  it("GET /api/videos/:id - should return 404 for non-existing video", async () => {
    await request(app).get("/api/videos/999999").expect(404);
  });

  it("POST /api/videos - should create new video with correct data", async () => {
    const newVideoData = {
      title: "My test video",
      author: "Dimash",
      availableResolutions: ["P720"],
    };

    const res = await request(app)
      .post("/api/videos")
      .send(newVideoData)
      .expect(201)
      .expect("Content-Type", /json/);

    expect(res.body).toMatchObject({
      title: newVideoData.title,
      author: newVideoData.author,
      availableResolutions: newVideoData.availableResolutions,
    });

    // Проверим, что видео действительно появилось в списке
    const all = await request(app).get("/api/videos").expect(200);
    const created = all.body.find((v: any) => v.title === "My test video");
    expect(created).toBeTruthy();
  });

  it("POST /api/videos - should return 400 if availableResolutions invalid", async () => {
    const invalidData = {
      title: "Bad video",
      author: "Someone",
      availableResolutions: ["BAD_RES"],
    };

    await request(app).post("/api/videos").send(invalidData).expect(400);
  });

  it("PUT /api/videos/:id - should update video with correct data", async () => {
    // создаём новое видео, чтобы было что редактировать
    const createRes = await request(app)
      .post("/api/videos")
      .send({
        title: "Original title",
        author: "Dimash",
        availableResolutions: ["P720"],
      })
      .expect(201);

    const videoId = createRes.body.id;

    // обновляем это видео
    await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: "Updated title",
        author: "Updated author",
        availableResolutions: ["P1080"],
        canBeDownloaded: false,
        minAgeRestriction: 18,
        publicationDate: new Date().toISOString(),
      })
      .expect(204);

    // проверяем, что изменения применились
    const getRes = await request(app).get(`/api/videos/${videoId}`).expect(200);
    expect(getRes.body.title).toBe("Updated title");
    expect(getRes.body.author).toBe("Updated author");
    expect(getRes.body.availableResolutions).toEqual(["P1080"]);
  });

  it("PUT /api/videos/:id - should return 404 for non-existing id", async () => {
    await request(app)
      .put("/api/videos/999999")
      .send({
        title: "No video",
        author: "Nobody",
        availableResolutions: ["P720"],
      })
      .expect(404);
  });

  it("PUT /api/videos/:id - should return 400 for invalid resolution", async () => {
    // создаём ещё одно видео
    const createRes = await request(app)
      .post("/api/videos")
      .send({
        title: "Bad update test",
        author: "Dimash",
        availableResolutions: ["P720"],
      })
      .expect(201);

    const videoId = createRes.body.id;

    await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: "Wrong res",
        author: "Test",
        availableResolutions: ["INVALID_RES"],
      })
      .expect(400);
  });

  it("DELETE /api/videos/:id - should delete existing video (204)", async () => {
    // Сначала создаём видео
    const createRes = await request(app)
      .post("/api/videos")
      .send({
        title: "To be deleted",
        author: "Dimash",
        availableResolutions: ["P720"],
      })
      .expect(201);

    const videoId = createRes.body.id;

    // Удаляем
    await request(app).delete(`/api/videos/${videoId}`).expect(204);

    // Проверяем, что его больше нет
    await request(app).get(`/api/videos/${videoId}`).expect(404);
  });

  it("DELETE /api/videos/:id - should return 404 for non-existing id", async () => {
    await request(app).delete("/api/videos/999999").expect(404);
  });
});
