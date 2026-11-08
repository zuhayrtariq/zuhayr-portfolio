import { DataStreamProvider } from "@/components/data-stream-provider";
import ClearChatButton from "@/components/clear-chat-button";
import HomeButton from "@/components/home-button";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataStreamProvider>
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <HomeButton />
          <ClearChatButton />
        </div>
      </header>
      <main id="main">{children}</main>
    </DataStreamProvider>
  );
}
