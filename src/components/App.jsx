import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { useStore } from "~/src/store.js";
import MainContent from "~/src/components/MainContent.jsx";
import LeaderboardSidebar from "~/src/components/LeaderboardSidebar.jsx";
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
      lineNumber: 22,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 21,
      columnNumber: 13
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex flex-col md:flex-row p-4 gap-4", children: [
    /* @__PURE__ */ jsxDEV(MainContent, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 29,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(LeaderboardSidebar, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 30,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 28,
    columnNumber: 9
  }, this);
}
export {
  App as default
};
