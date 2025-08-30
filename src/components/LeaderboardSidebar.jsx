import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import { useQuery } from "@websim/use-query";
import { PulseLoader } from "react-spinners";
import { room } from "~/src/db.js";
import LeaderboardModal from "~/src/components/modals/LeaderboardModal.jsx";
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
      lineNumber: 31,
      columnNumber: 13
    }, this),
    loading && /* @__PURE__ */ jsxDEV("div", { className: "text-center p-4", children: /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2", size: 8 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 32,
      columnNumber: 58
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 32,
      columnNumber: 25
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-3 overflow-y-auto", children: leaderboard && leaderboard.map((item, index) => /* @__PURE__ */ jsxDEV("div", { className: "leaderboard-item p-3 border border-gray-700 rounded-md bg-gray-700/50 flex justify-between items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex-grow overflow-hidden", children: [
        /* @__PURE__ */ jsxDEV("p", { className: "font-bold truncate", children: [
          "Generation ",
          item.generation
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 37,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "text-xs text-gray-400 truncate", children: item.source_projects?.map((p) => p.title).join(" + ") }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 38,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "text-yellow-400 font-semibold", children: [
          item.votes,
          " votes"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 41,
          columnNumber: 29
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 36,
        columnNumber: 25
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: () => handleViewMerge(item.id), className: "ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors", children: "View" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 43,
        columnNumber: 25
      }, this)
    ] }, item.id, true, {
      fileName: "<stdin>",
      lineNumber: 35,
      columnNumber: 21
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 33,
      columnNumber: 13
    }, this),
    showModal && /* @__PURE__ */ jsxDEV(LeaderboardModal, { mergeId: selectedMergeId, onClose: () => setShowModal(false) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 49,
      columnNumber: 27
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 30,
    columnNumber: 9
  }, this);
}
export {
  LeaderboardSidebar as default
};
