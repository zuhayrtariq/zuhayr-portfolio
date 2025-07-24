import Script from "next/script";
import { DataStreamProvider } from "@/components/data-stream-provider";
import ClearChatButton from "@/components/clear-chat-button";
import { SparklesCore } from "@/components/ui/sparkles";
import HomeButton from "@/components/home-button";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <div className="w-full absolute inset-0 min-h-screen">
          <SparklesCore
            id="tsparticles2fullpage"
            background="transparent"
            minSize={0.6}
            maxSize={0.8}
            particleDensity={5}
            speed={1}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </div>
        <div className="flex justify-between items-center w-full px-4 py-2 border-b border-gray-900 shadow-xl bg-black/50 backdrop-blur sticky top-0 z-10">
          <HomeButton />
          <ClearChatButton />
        </div>

        {children}
      </DataStreamProvider>
    </div>
  );
}
