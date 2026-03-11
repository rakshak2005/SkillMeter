require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
const PORT = Number(process.env.PORT || 5000);

/* ---------------- TEMP ---------------- */
const TEMP_UPLOAD_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

/* ---------------- FIREBASE ---------------- */
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

/* ---------------- MULTER ---------------- */
const upload = multer({ dest: TEMP_UPLOAD_DIR });

/* ---------------- AUTH ---------------- */
async function verifyFirebaseToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

/* ---------------- UTILS ---------------- */
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round = (v) => Math.round(v * 10) / 10;

/* ---------------- USERNAME EXTRACT ---------------- */
function extractGithubUsername(url) {
  try {
    return new URL(url).pathname.split("/").filter(Boolean)[0];
  } catch {
    return null;
  }
}

function extractLeetcodeUsername(url) {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);

    if (parts.includes("u")) return parts[parts.indexOf("u") + 1];
    if (parts.includes("profile")) return parts[parts.indexOf("profile") + 1];

    return parts[0];
  } catch {
    return null;
  }
}

/* ---------------- GITHUB ANALYSIS (FIXED) ---------------- */
async function analyzeGithub(username) {
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

  const repoRes = await axios.get(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    { headers }
  );

  const repos = repoRes.data;

  const analyzed = await Promise.all(
    repos.slice(0, 10).map(async (repo) => {
      try {
        // README
        let hasReadme = false;
        try {
          await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/readme`,
            { headers }
          );
          hasReadme = true;
        } catch {}

        // LICENSE
        const hasLicense = !!repo.license;

        // LANGUAGES
        const langRes = await axios.get(repo.languages_url, { headers });
        const languages = Object.keys(langRes.data);

        // FILE STRUCTURE
        const contents = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/contents`,
          { headers }
        );

        const fileCount = contents.data.length;

        // ACTIVITY
        const isActive =
          Date.now() - new Date(repo.updated_at) <
          90 * 24 * 60 * 60 * 1000;

        // SCORE
        let score = 0;
        if (hasReadme) score += 2;
        if (hasLicense) score += 1.5;
        if (languages.length >= 2) score += 2;
        if (fileCount > 5) score += 2;
        if (isActive) score += 2;

        score += clamp(repo.stargazers_count / 10, 0, 2);
        score += clamp(repo.forks_count / 5, 0, 1.5);

        return {
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          languages,
          hasReadme,
          hasLicense,
          isActive,
          fileCount,
          score: round(score),
        };
      } catch {
        return null;
      }
    })
  );

  const valid = analyzed.filter(Boolean);

  const avgQuality =
    valid.reduce((sum, r) => sum + r.score, 0) /
    (valid.length || 1);

  const topRepos = valid
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    score: round(clamp((avgQuality / 12) * 30, 0, 30)),
    details: {
      analyzedRepos: valid.length,
      avgQuality: round(avgQuality),
      repos: valid,
      topRepos,
    },
  };
}

/* ---------------- LEETCODE (FIXED) ---------------- */
async function analyzeLeetcode(username) {
  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          profile {
            ranking
          }
        }
      }
    `,
    variables: { username },
  };

  const res = await axios.post("https://leetcode.com/graphql", query);

  const user = res.data?.data?.matchedUser;

  if (!user) throw new Error("LeetCode user not found");

  const stats = user.submitStats.acSubmissionNum;

  const easy = stats.find(s => s.difficulty === "Easy")?.count || 0;
  const medium = stats.find(s => s.difficulty === "Medium")?.count || 0;
  const hard = stats.find(s => s.difficulty === "Hard")?.count || 0;

  const ranking = user.profile.ranking || 300000;

  let score = 0;
  score += clamp(easy / 200, 0, 1) * 5;
  score += clamp(medium / 200, 0, 1) * 10;
  score += clamp(hard / 100, 0, 1) * 10;
  score += clamp((300000 - ranking) / 300000, 0, 1) * 5;

  return {
    score: round(score),
    details: { easy, medium, hard, ranking },
  };
}

/* ---------------- ROUTE ---------------- */
app.post(
  "/api/analyze-profile",
  verifyFirebaseToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "certificates", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { githubUrl, leetcodeUrl } = req.body;

      let githubData = null;
      let leetcodeData = null;

      let totalRaw = 0;
      let maxPossible = 0;

      // GitHub
      if (githubUrl) {
        const user = extractGithubUsername(githubUrl);
        if (user) {
          githubData = await analyzeGithub(user);
          totalRaw += githubData.score;
          maxPossible += 30;
        }
      }

      // LeetCode
      if (leetcodeUrl) {
        const user = extractLeetcodeUsername(leetcodeUrl);
        if (user) {
          try {
            leetcodeData = await analyzeLeetcode(user);
            totalRaw += leetcodeData.score;
            maxPossible += 30;
          } catch (e) {
            console.log("LeetCode failed:", e.message);
          }
        }
      }

      const totalScore =
        maxPossible === 0 ? 0 : round((totalRaw / maxPossible) * 100);

      res.json({
        totalScore,
        breakdown: {
          github: githubData?.score || 0,
          leetcode: leetcodeData?.score || 0,
        },
        details: {
          github: githubData?.details || null,
          leetcode: leetcodeData?.details || null,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});