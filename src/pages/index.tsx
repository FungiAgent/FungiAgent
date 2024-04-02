// React
import React from "react";
// import ErrorPage from "@/components/Sections/Fallbacks/ErrorPage";
import ActionsSideBar from "@/components/Layout/ActionsSideBar";
import AgentChat from "@/components/Sections/Main/AgentChat";

export default function HomePage() {

  return (
    <div>
      {/* <AgentChat /> */}
      <ActionsSideBar isHistory={false} />
    </div>
  );
}
