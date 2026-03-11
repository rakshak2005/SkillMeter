import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

export default function Dashboard() {
  const [githubUrl, setGithubUrl] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [certs, setCerts] = useState<FileList | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) return alert("Login required");

      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append("githubUrl", githubUrl);
      formData.append("leetcodeUrl", leetcodeUrl);

      if (resume) formData.append("resume", resume);
      if (certs) {
        Array.from(certs).forEach((file) =>
          formData.append("certificates", file)
        );
      }

      const res = await axios.post(
        "http://localhost:5000/api/analyze-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Error analyzing");
    } finally {
      setLoading(false);
    }
  };

  const score = result?.totalScore || 0;
  const percentage = (score / 100) * 360;

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">SkillMeter Dashboard</h1>
          <p className="text-sm text-gray-400">
            {auth.currentUser?.email}
          </p>
        </div>

        <button
          onClick={() => auth.signOut()}
          className="border px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT INPUTS */}
        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Inputs</h2>

          <input
            type="text"
            placeholder="GitHub URL"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full mb-3 p-3 rounded bg-[#1e293b]"
          />

          <input
            type="text"
            placeholder="LeetCode URL"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            className="w-full mb-3 p-3 rounded bg-[#1e293b]"
          />

          <input
            type="file"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="mb-3"
          />

          <input
            type="file"
            multiple
            onChange={(e) => setCerts(e.target.files)}
            className="mb-4"
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-purple-600 py-3 rounded-lg font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* RIGHT SCORE */}
        <div className="bg-[#0f172a] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Hire Readiness Score
          </h2>

          {/* CIRCLE */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#f59e0b ${percentage}deg, #1e293b ${percentage}deg)`,
                }}
              />
              <div className="absolute inset-4 bg-[#050816] rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{score}</p>
                  <p className="text-xs text-gray-400">/100</p>
                </div>
              </div>
            </div>
          </div>

          {/* BREAKDOWN */}
          {result && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Metric label="GitHub" value={result.breakdown.github} />
              <Metric label="LeetCode" value={result.breakdown.leetcode} />
              <Metric label="Resume" value={result.breakdown.resume} />
              <Metric label="Certs" value={result.breakdown.certificates} />
            </div>
          )}

          {/* GITHUB ANALYTICS */}
          {result?.details?.github && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                GitHub Insights
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <Metric label="Repos" value={result.details.github.repoCount} />
                <Metric label="Active" value={result.details.github.activeRepos} />
                <Metric label="Stars" value={result.details.github.totalStars} />
                <Metric label="Forks" value={result.details.github.totalForks} />
                <Metric label="Avg Size" value={result.details.github.avgRepoSize} />
                <Metric
                  label="Languages"
                  value={result.details.github.languages?.join(", ")}
                />
              </div>

              {/* TOP PROJECTS */}
              <div>
                <h4 className="text-sm text-gray-400 mb-2">
                  Top Projects
                </h4>

                {result.details.github.topRepos?.map(
                  (repo: any, i: number) => (
                    <a
                      key={i}
                      href={repo.url}
                      target="_blank"
                      className="block p-3 mb-2 bg-[#1e293b] rounded-lg hover:bg-[#334155]"
                    >
                      <div className="flex justify-between">
                        <span>{repo.name}</span>
                        <span>⭐ {repo.stars}</span>
                      </div>
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENT ---------------- */
function Metric({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-[#1e293b] p-3 rounded-lg text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-lg font-bold">{value ?? 0}</p>
    </div>
  );
}