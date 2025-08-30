import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { useQuery } from "@websim/use-query";
import { useStore } from "~/src/store.js";
import { room } from "~/src/db.js";
import SourceCodeModal from "~/src/components/modals/SourceCodeModal.jsx";
function HeaderContent({ currentMerge, currentUser }) {
  const [showSources, setShowSources] = useState(false);
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
    if (!currentUser || hasVoted || !currentMerge) return;
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
        lineNumber: 41,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-400", children: [
        "Generation: ",
        currentMerge.generation || "N/A"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 42,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 40,
      columnNumber: 13
    }, this),
    sourceProjects.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "text-sm text-gray-300", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "font-semibold", children: "Merged from:" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: `https://websim.com/p/${sourceProjects[0].id}`, target: "_blank", rel: "noopener noreferrer", className: "ml-2 text-blue-400 hover:underline", children: sourceProjects[0].title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 47,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "mx-2", children: "&" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 48,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("a", { href: `https://websim.com/p/${sourceProjects[1].id}`, target: "_blank", rel: "noopener noreferrer", className: "text-blue-400 hover:underline", children: sourceProjects[1].title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 49,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 45,
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
              lineNumber: 58,
              columnNumber: 21
            }, this),
            " View Code"
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 53,
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
              lineNumber: 65,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: voteCount }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 66,
              columnNumber: 21
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 60,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 52,
      columnNumber: 13
    }, this),
    showSources && /* @__PURE__ */ jsxDEV(SourceCodeModal, { merge: currentMerge, onClose: () => setShowSources(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 69,
      columnNumber: 29
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 39,
    columnNumber: 9
  }, this);
}
function Header() {
  const { currentUser, currentMerge } = useStore();
  if (!currentMerge) {
    return /* @__PURE__ */ jsxDEV("div", { className: "p-4 bg-gray-700/50 border-b border-gray-600 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { className: "text-xl font-bold", children: "Web Sim Chimera" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 81,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-400", children: "Generation: N/A" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 80,
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
                lineNumber: 89,
                columnNumber: 25
              }, this),
              " View Code"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 85,
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
                lineNumber: 95,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("span", { children: "0" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 96,
                columnNumber: 25
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 91,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 79,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV(HeaderContent, { currentMerge, currentUser }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 103,
    columnNumber: 12
  }, this);
}
export {
  Header as default
};
