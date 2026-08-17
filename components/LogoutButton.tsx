"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      const result = await signOut({
        redirect: false,
        redirectTo: "/login",
      });

      window.location.assign(result.url);
    } catch {
      setErrorMessage("退出失败，请确认服务器和网络正常后重试");
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="text-blue-600 hover:underline disabled:text-gray-400"
      >
        {isSigningOut ? "正在退出..." : "退出登录"}
      </button>
      {errorMessage && (
        <span role="alert" className="text-red-600">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
