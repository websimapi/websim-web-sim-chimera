import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useCallback, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WebsimSocket, useQuery } from "@websim/use-query";
import { create } from "zustand";
import { PulseLoader } from "react-spinners";
const room = new WebsimSocket();
const useStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  isAppLoading: true,
  // New state for initial app load
  setIsAppLoading: (loading) => set({ isAppLoading: loading }),
  isLoading: true,
  setIsLoading: (loading) => set({ isLoading: loading }),
  loadingMessage: "Initializing...",
  setLoadingMessage: (message) => set({ loadingMessage: message }),
  currentMerge: null,
  setCurrentMerge: (merge) => set({ currentMerge: merge })
}));
function App() {
  const { setCurrentUser, isAppLoading, setIsAppLoading } = useStore();
  useEffect(() => {
    const fetchUser = async () => {
      const user = await window.websim.getCurrentUser();
      setCurrentUser(user);
      setIsAppLoading(false);
    };
    fetchUser();
  }, [setCurrentUser, setIsAppLoading]);
  if (isAppLoading) {
    return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center bg-gray-900", children: /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 37,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex flex-col md:flex-row p-4 gap-4", children: [
    /* @__PURE__ */ jsxDEV(MainContent, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 45,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(LeaderboardSidebar, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 44,
    columnNumber: 9
  }, this);
}
function MainContent() {
  const { isLoading, loadingMessage, currentMerge, setCurrentMerge, setIsLoading, setLoadingMessage } = useStore();
  const fetchLatestMerge = useCallback(async () => {
    setLoadingMessage("Fetching latest creation...");
    const latest = await room.query("SELECT * FROM public.merges_v2 ORDER BY created_at DESC LIMIT 1").getList();
    if (latest && latest.length > 0) {
      setCurrentMerge(latest[0]);
    }
    return latest && latest.length > 0 ? latest[0] : null;
  }, [setCurrentMerge, setLoadingMessage]);
  const createNewMerge = useCallback(async (latestMerge) => {
    try {
      setLoadingMessage("Fetching trending projects...");
      const response = await fetch(`https://websim.com/api/v1/projects/trending?limit=10`);
      const { data } = await response.json();
      const projects = data.map((p) => p.project);
      if (projects.length < 2) {
        setLoadingMessage("Not enough projects to merge. Waiting...");
        return null;
      }
      const project1 = projects[Math.floor(Math.random() * projects.length)];
      let project2 = projects[Math.floor(Math.random() * projects.length)];
      while (project2.id === project1.id) {
        project2 = projects[Math.floor(Math.random() * projects.length)];
      }
      setLoadingMessage(`Fetching code for ${project1.title} and ${project2.title}...`);
      const [code1Res, code2Res] = await Promise.all([
        fetch(`https://websim.com/api/v1/projects/${project1.id}/files`),
        fetch(`https://websim.com/api/v1/projects/${project2.id}/files`)
      ]);
      const code1 = await code1Res.json();
      const code2 = await code2Res.json();
      const p1Files = {
        html: code1.files["index.html"] || "",
        css: code1.files["styles.css"] || "",
        js: Object.entries(code1.files).find(([name]) => name.endsWith(".js") || name.endsWith(".jsx"))?.[1] || ""
      };
      const p2Files = {
        html: code2.files["index.html"] || "",
        css: code2.files["styles.css"] || "",
        js: Object.entries(code2.files).find(([name]) => name.endsWith(".js") || name.endsWith(".jsx"))?.[1] || ""
      };
      setLoadingMessage("AI is merging the code... This can take a moment.");
      const completion = await websim.chat.completions.create({
        messages: [
          { role: "system", content: `You are an expert web developer AI. Your task is to merge two web applications into a single, functional, and creative one.
Combine the HTML, CSS, and JavaScript from both projects. The resulting application must be a single self-contained HTML file. Put CSS in a <style> tag and JS in a <script> tag within the HTML.
Do NOT use external libraries unless they are imported via an ESM CDN like esm.sh. Do not assume any files exist.
The result should be visually interesting and functionally coherent.
Respond ONLY with a JSON object with the keys "html", "css", and "js". Do not include any other text or explanations.` },
          { role: "user", content: `Project 1 (${project1.title}):
HTML:
\`\`\`html
${p1Files.html}
\`\`\`
CSS:
\`\`\`css
${p1Files.css}
\`\`\`
JS:
\`\`\`javascript
${p1Files.js}
\`\`\`
                    ` }
        ],
        json: true
      });
      const result = JSON.parse(completion.content);
      setLoadingMessage("Saving new creation...");
      const newMerge = await room.collection("merges_v2").create({
        generation: (latestMerge?.generation || 0) + 1,
        source_projects: [
          { id: project1.id, title: project1.title },
          { id: project2.id, title: project2.title }
        ],
        html_code: result.html || "",
        css_code: result.css || "",
        js_code: result.js || ""
      });
      setCurrentMerge(newMerge);
      return newMerge;
    } catch (error) {
      console.error("Error creating new merge:", error);
      setLoadingMessage(`An error occurred. Retrying in 10s. Error: ${error.message}`);
      return null;
    }
  }, [setCurrentMerge, setLoadingMessage]);
  useEffect(() => {
    let timeoutId;
    const mergeLoop = async () => {
      setIsLoading(true);
      const latestMerge = await fetchLatestMerge();
      const newMerge = await createNewMerge(latestMerge);
      setIsLoading(false);
      if (newMerge) {
        timeoutId = setTimeout(mergeLoop, 6e4);
      } else {
        timeoutId = setTimeout(mergeLoop, 1e4);
      }
    };
    mergeLoop();
    return () => clearTimeout(timeoutId);
  }, [fetchLatestMerge, createNewMerge, setIsLoading]);
  const srcDoc = currentMerge ? `
        <html>
            <head>
                <style>${currentMerge.css_code}</style>
            </head>
            <body>
                ${currentMerge.html_code}
                <script type="module">${currentMerge.js_code}<\/script>
            </body>
        </html>
    ` : "";
  return /* @__PURE__ */ jsxDEV("main", { className: "flex-grow flex flex-col bg-gray-800 rounded-lg shadow-xl overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV(Header, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 172,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-grow relative", children: [
      isLoading && /* @__PURE__ */ jsxDEV("div", { className: "loader-overlay generating-pulse", children: [
        /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 176,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-4 animate-pulse", children: loadingMessage }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 177,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 175,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV(
        "iframe",
        {
          srcDoc,
          title: "Live Preview",
          sandbox: "allow-scripts allow-same-origin",
          className: "w-full h-full border-0"
        },
        currentMerge?.id,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 180,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 173,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 171,
    columnNumber: 9
  }, this);
}
function HeaderContent({ currentMerge, currentUser, showSources, setShowSources }) {
  const [hasVoted, setHasVoted] = useState(false);
  const { data: votes } = useQuery(
    currentMerge ? room.collection("votes_v2").filter({ merge_id: currentMerge.id }) : null
  );
  useEffect(() => {
    if (currentUser && votes) {
      setHasVoted(votes.some((v) => v.user_id === currentUser.id));
    } else {
      setHasVoted(false);
    }
  }, [currentUser, votes]);
  const handleVote = async () => {
    if (!currentUser || hasVoted) return;
    try {
      await room.collection("votes_v2").upsert({
        id: `${currentUser.id}-${currentMerge.id}`,
        merge_id: currentMerge.id
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };
  const sourceProjects = currentMerge.source_projects || [];
  const voteCount = votes?.length || 0;
  return /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-gray-700/50 border-b border-gray-600 flex flex-wrap items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold", children: "Web Sim Chimera" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 227,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-400", children: [
        "Generation: ",
        currentMerge.generation || "N/A"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 228,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 226,
      columnNumber: 13
    }, this),
    sourceProjects.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: "Merged from:" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 232,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: `https://websim.com/p/${sourceProjects[0].id}`, target: "_blank", rel: "noopener noreferrer", className: "ml-2 text-blue-400 hover:underline", children: sourceProjects[0].title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 233,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "mx-2", children: "&" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 234,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: `https://websim.com/p/${sourceProjects[1].id}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:underline", children: sourceProjects[1].title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 231,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: () => setShowSources(true),
          className: "px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-sm transition-colors",
          disabled: !currentMerge,
          children: [
            /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-code mr-2" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 244,
              columnNumber: 21
            }, this),
            " View Code"
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 239,
          columnNumber: 18
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          onClick: handleVote,
          disabled: hasVoted || !currentUser,
          className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxDEV("i", { className: `fa-solid fa-star ${hasVoted ? "text-yellow-400" : ""}` }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 251,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: voteCount }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 252,
              columnNumber: 21
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 246,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 238,
      columnNumber: 13
    }, this),
    showSources && /* @__PURE__ */ jsxDEV(SourceCodeModal, { merge: currentMerge, onClose: () => setShowSources(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 255,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 225,
    columnNumber: 9
  }, this);
}
function Header() {
  const { currentUser, currentMerge } = useStore();
  const [showSources, setShowSources] = useState(false);
  if (!currentMerge) {
    return /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-gray-700/50 border-b border-gray-600 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold", children: "Web Sim Chimera" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 269,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-400", children: "Generation: N/A" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 270,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 268,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "px-4 py-2 bg-gray-600 rounded-md text-sm opacity-50 cursor-not-allowed",
            disabled: true,
            children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-code mr-2" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 277,
                columnNumber: 25
              }, this),
              " View Code"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 273,
            columnNumber: 22
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            disabled: true,
            className: "px-4 py-2 bg-gray-500 rounded-md text-sm cursor-not-allowed flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxDEV("i", { className: "fa-solid fa-star" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 283,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: "0" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 284,
                columnNumber: 25
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 279,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 272,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 267,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(HeaderContent, { currentMerge, currentUser, showSources, setShowSources }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 291,
    columnNumber: 12
  }, this);
}
function LeaderboardSidebar() {
  const { data: leaderboard, loading } = useQuery(room.query(`
        WITH vote_counts AS (
            SELECT merge_id, COUNT(*) as votes
            FROM public.votes_v2
            GROUP BY merge_id
        )
        SELECT m.id, m.generation, m.source_projects, vc.votes
        FROM public.merges_v2 m
        JOIN vote_counts vc ON m.id = vc.merge_id
        ORDER BY vc.votes DESC, m.created_at DESC
        LIMIT 10
    `));
  const [showModal, setShowModal] = useState(false);
  const [selectedMergeId, setSelectedMergeId] = useState(null);
  const handleViewMerge = (id) => {
    setSelectedMergeId(id);
    setShowModal(true);
  };
  return /* @__PURE__ */ jsxDEV("aside", { className: "w-full md:w-80 lg:w-96 flex-shrink-0 bg-gray-800 rounded-lg shadow-xl p-4 flex flex-col", children: [
    /* @__PURE__ */ jsxDEV("h2", { className: "text-lg font-bold border-b border-gray-600 pb-2 mb-4", children: "Top Merges" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 318,
      columnNumber: 13
    }, this),
    loading && /* @__PURE__ */ jsxDEV("div", { className: "text-center p-4", children: /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2", size: 8 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 319,
      columnNumber: 58
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 319,
      columnNumber: 25
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 overflow-y-auto", children: leaderboard && leaderboard.map((item, index) => /* @__PURE__ */ jsxDEV("div", { className: "leaderboard-item p-3 border border-gray-700 rounded-md bg-gray-700/50 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex-grow overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "font-bold truncate", children: [
          "Generation ",
          item.generation
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 324,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-400 truncate", children: item.source_projects?.map((p) => p.title).join(" + ") }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 325,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-yellow-400 font-semibold", children: [
          item.votes,
          " votes"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 328,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 323,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => handleViewMerge(item.id), className: "ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors", children: "View" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 330,
        columnNumber: 25
      }, this)
    ] }, item.id, true, {
      fileName: "<stdin>",
      lineNumber: 322,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 320,
      columnNumber: 13
    }, this),
    showModal && /* @__PURE__ */ jsxDEV(LeaderboardModal, { mergeId: selectedMergeId, onClose: () => setShowModal(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 336,
      columnNumber: 27
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 317,
    columnNumber: 9
  }, this);
}
function SourceCodeModal({ merge, onClose }) {
  const [activeTab, setActiveTab] = useState("html");
  return /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxDEV("div", { className: "modal-content w-full max-w-4xl", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold", children: [
        "Source Code for Generation ",
        merge.generation
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 348,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: onClose, className: "text-gray-400 hover:text-white", children: "\xD7" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 349,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 347,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-gray-600 mb-2", children: [
        /* @__PURE__ */ jsxDEV("button", { className: `tab-button ${activeTab === "html" ? "active" : ""}`, onClick: () => setActiveTab("html"), children: "HTML" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 353,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: `tab-button ${activeTab === "css" ? "active" : ""}`, onClick: () => setActiveTab("css"), children: "CSS" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 354,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: `tab-button ${activeTab === "js" ? "active" : ""}`, onClick: () => setActiveTab("js"), children: "JS" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 355,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 352,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        activeTab === "html" && /* @__PURE__ */ jsxDEV("pre", { className: "code-block", children: /* @__PURE__ */ jsxDEV("code", { children: merge.html_code }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 358,
          columnNumber: 78
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 358,
          columnNumber: 50
        }, this),
        activeTab === "css" && /* @__PURE__ */ jsxDEV("pre", { className: "code-block", children: /* @__PURE__ */ jsxDEV("code", { children: merge.css_code }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 359,
          columnNumber: 77
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 359,
          columnNumber: 49
        }, this),
        activeTab === "js" && /* @__PURE__ */ jsxDEV("pre", { className: "code-block", children: /* @__PURE__ */ jsxDEV("code", { children: merge.js_code }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 360,
          columnNumber: 76
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 360,
          columnNumber: 48
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 357,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 351,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 346,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 345,
    columnNumber: 9
  }, this);
}
function LeaderboardModal({ mergeId, onClose }) {
  const { data: mergeData, loading } = useQuery(
    mergeId ? room.collection("merges_v2").filter({ id: mergeId }) : null
  );
  const merge = mergeData && mergeData.length > 0 ? mergeData[0] : null;
  if (loading || !merge) {
    return /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", children: /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 375,
      columnNumber: 48
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 375,
      columnNumber: 16
    }, this);
  }
  const srcDoc = `
        <html>
            <head><style>${merge.css_code}</style></head>
            <body>
                ${merge.html_code}
                <script type="module">${merge.js_code}<\/script>
            </body>
        </html>
    `;
  return /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxDEV("div", { className: "modal-content w-full max-w-6xl h-full flex flex-col", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4 flex-shrink-0", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold", children: [
        "Viewing Generation ",
        merge.generation
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 392,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: onClose, className: "text-2xl text-gray-400 hover:text-white", children: "\xD7" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 393,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 391,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-grow border border-gray-600 rounded-md overflow-hidden", children: /* @__PURE__ */ jsxDEV("iframe", { srcDoc, title: `Preview of Generation ${merge.generation}`, sandbox: "allow-scripts allow-same-origin", className: "w-full h-full border-0" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 396,
      columnNumber: 22
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 395,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 390,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 389,
    columnNumber: 9
  }, this);
}
const root = createRoot(document.getElementById("root"));
root.render(
  /* @__PURE__ */ jsxDEV(StrictMode, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 407,
    columnNumber: 9
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 406,
    columnNumber: 5
  })
);
