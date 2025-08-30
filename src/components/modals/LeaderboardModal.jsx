import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { useQuery } from "@websim/use-query";
import { PulseLoader } from "react-spinners";
import { room } from "~/src/db.js";
function LeaderboardModal({ mergeId, onClose }) {
  const { data: mergeData, loading } = useQuery(
    mergeId ? room.collection("merges_v2").filter({ id: mergeId }) : null
  );
  const merge = mergeData && mergeData.length > 0 ? mergeData[0] : null;
  if (loading || !merge) {
    return /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", children: /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 13,
      columnNumber: 48
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 13,
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
        lineNumber: 30,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: onClose, className: "text-2xl text-gray-400 hover:text-white", children: "\xD7" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 31,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 29,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-grow border border-gray-600 rounded-md overflow-hidden", children: /* @__PURE__ */ jsxDEV("iframe", { srcDoc, title: `Preview of Generation ${merge.generation}`, sandbox: "allow-scripts allow-same-origin", className: "w-full h-full border-0" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 34,
      columnNumber: 22
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 33,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 28,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 27,
    columnNumber: 9
  }, this);
}
export {
  LeaderboardModal as default
};
