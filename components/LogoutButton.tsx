"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    await signOut({
      redirectTo: "/login",
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="text-blue-600 hover:underline disabled:text-gray-400"
    >
      {isSigningOut ? "正在退出..." : "退出登录"}
    </button>
  );
}
