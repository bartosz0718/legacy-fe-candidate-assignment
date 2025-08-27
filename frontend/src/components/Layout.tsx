import { ReactNode } from "react";
import { Outlet } from "react-router";

interface AppLayoutProps {
  children?: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col">
      <div className="m-auto px-4 pb-20 overflow-y-auto w-full max-w-screen-lg">
        {children || <Outlet />}
      </div>
    </div>
  );
}

export default AppLayout;
