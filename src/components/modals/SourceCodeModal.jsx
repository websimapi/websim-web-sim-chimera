import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
function SourceCodeModal({ merge, onClose }) {
  const [activeTab, setActiveTab] = useState("html");
  return /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxDEV("div", { className: "modal-content w-full max-w-4xl", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-center mb-4", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-lg font-bold", children: [
        "Source Code for Generation ",
        merge.generation
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("button", { onClick: onClose, className: "text-gray-400 hover:text-white", children: "\xD7" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 11,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex border-b border-gray-600 mb-2", children: [
        /* @__PURE__ */ jsxDEV("button", { className: `tab-button ${activeTab === "html" ? "active" : ""}`, onClick: () => setActiveTab("html"), children: "HTML" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 15,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: `tab-button ${activeTab === "css" ? "active" : ""}`, onClick: () => setActiveTab("css"), children: "CSS" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 16,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: `tab-button ${activeTab === "js" ? "active" : ""}`, onClick: () => setActiveTab("js"), children: "JS" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 17,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 14,
        columnNumber: 21
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        activeTab === "html" && /* @__PURE__ */ jsxDEV("pre", { className: "code-block", children: /* @__PURE__ */ jsxDEV("code", { children: merge.html_code }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 20,
          columnNumber: 78
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 20,
          columnNumber: 50
        }, this),
        activeTab === "css" && /* @__PURE__ */ jsxDEV("pre", { className: "code-block", children: /* @__PURE__ */ jsxDEV("code", { children: merge.css_code }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 21,
          columnNumber: 77
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 21,
          columnNumber: 49
        }, this),
        activeTab === "js" && /* @__PURE__ */ jsxDEV("pre", { className: "code-block", children: /* @__PURE__ */ jsxDEV("code", { children: merge.js_code }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 22,
          columnNumber: 76
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 22,
          columnNumber: 48
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 19,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 13,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 9
  }, this);
}
export {
  SourceCodeModal as default
};
