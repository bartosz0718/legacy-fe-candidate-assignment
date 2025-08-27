import SignMessage from "../components/SignMessage";
import WalletInfo from "../components/WalletInfo";
import History from "../components/History";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { Navigate } from "react-router-dom";

function Home() {
  const isLoggedIn = useIsLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="space-y-4">
      <WalletInfo />
      <SignMessage />
      <History />
    </div>
  );
}

export default Home;
