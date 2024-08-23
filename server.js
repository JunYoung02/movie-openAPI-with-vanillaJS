const express = require("express");
const axios = require("axios");
const env = require("dotenv");
const cors = require("cors");

env.config({ path: ".env" }); // .env 파일에서 환경 변수를 로드

const app = express();

// 정적 파일 서빙 (index.html, common.js)
app.use(express.static(__dirname));

// cors 오류 설정
app.use(
  cors({
    origin: "*",
  })
);
const key = process.env.MOVIE_API_KEY;

// 기본 경로 설정
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // 기본 경로로 index.html 제공
});

// ** API 요청 엔드포인트들 설정
// * [get] Top Rated
app.get("/api/toprated/", async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?language=ko-ko&page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// * [get] UpComing
app.get("/api/upcoming/", async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?language=ko-ko&page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// * [get] Now Playing
app.get("/api/nowplaying/", async (req, res) => {
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/now_playing?language=ko-ko&page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// * [get] Details
app.get("/api/details/", async (req, res) => {
  const movieId = req.query.id;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?language=ko-ko`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// * [get] Credits
app.get("/api/credits/", async (req, res) => {
  const movieId = req.query.id;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-ko`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// * [get] Videos
app.get("/api/videos/", async (req, res) => {
  const movieId = req.query.id;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=ko-ko`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// * [get] search movie
app.get("/api/search/", async (req, res) => {
  const title = req.query.title;
  const page = req.query.page || 1;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=ko-ko&page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
    res.json(response.data); // 클라이언트에 JSON 응답 반환
  } catch (error) {
    res.status(500).json({ error: "Error fetching data 여기서 실패" });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
