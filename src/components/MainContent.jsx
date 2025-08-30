import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { useStore } from "~/src/store.js";
import Header from "~/src/components/Header.jsx";
import { fetchLatestMerge, createNewMerge } from "~/src/services/mergeService.js";
function MainContent() {
  const {
    isLoading,
    loadingMessage,
    currentMerge,
    setCurrentMerge,
    setIsLoading,
    setLoadingMessage
  } = useStore();
  useEffect(() => {
    let timeoutId;
    const mergeLoop = async () => {
      setIsLoading(true);
      const latestMerge = await fetchLatestMerge(setLoadingMessage);
      if (latestMerge) {
        setCurrentMerge(latestMerge);
      }
      const newMerge = await createNewMerge(latestMerge, setLoadingMessage);
      if (newMerge) {
        setCurrentMerge(newMerge);
      }
      setIsLoading(false);
      if (newMerge) {
        timeoutId = setTimeout(mergeLoop, 6e4);
      } else {
        timeoutId = setTimeout(mergeLoop, 1e4);
      }
    };
    mergeLoop();
    return () => clearTimeout(timeoutId);
  }, [setCurrentMerge, setIsLoading, setLoadingMessage]);
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
      lineNumber: 59,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-grow relative", children: [
      isLoading && /* @__PURE__ */ jsxDEV("div", { className: "loader-overlay generating-pulse", children: [
        /* @__PURE__ */ jsxDEV(PulseLoader, { color: "#4A90E2" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 63,
          columnNumber: 25
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "mt-4 animate-pulse", children: loadingMessage }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 64,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 62,
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
          lineNumber: 67,
          columnNumber: 17
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 60,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 58,
    columnNumber: 9
  }, this);
}
export {
  MainContent as default
};
