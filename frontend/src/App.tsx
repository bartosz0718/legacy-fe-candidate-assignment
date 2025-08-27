import { useRoutes } from "react-router-dom";
import routes from "./router";

export default function App() {
  const content = useRoutes(routes);

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto p-6 gap-6 w-full">
      <header>
        <h1 className="text-3xl font-bold text-center">
          Web3 Message Signer (Using Dynamic)
        </h1>
      </header>

      <main className="flex-1">
        {content}
      </main>

      <footer className="text-center text-sm text-gray-500">
        <a
          href="https://www.dynamic.xyz"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Dynamic
        </a>
      </footer>
    </div>
  );
}