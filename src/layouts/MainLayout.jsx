import { Outlet, useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";

export default function MainLayout() {
  // App-level state and methods to pass to nested routes
  const outletContext = {
    // Add any app-level state or methods here that need to be shared
    // with nested routes via useOutletContext()
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}