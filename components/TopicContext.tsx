"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type DeployTopic = "performance" | "sla" | "revenue";

type Ctx = {
  deployedTopic: DeployTopic;
  setDeployedTopic: (t: DeployTopic) => void;
};

const TopicCtx = createContext<Ctx>({
  deployedTopic: "performance",
  setDeployedTopic: () => {},
});

export function TopicProvider({ children }: { children: ReactNode }) {
  const [deployedTopic, setDeployedTopic] = useState<DeployTopic>("performance");
  return (
    <TopicCtx.Provider value={{ deployedTopic, setDeployedTopic }}>
      {children}
    </TopicCtx.Provider>
  );
}

export function useDeployedTopic() {
  return useContext(TopicCtx);
}
