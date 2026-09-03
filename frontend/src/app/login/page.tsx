"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "@/lib/auth";
import {
  getAccessToken,
  setAccessToken,
} from "@/lib/auth-storage";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/notes");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await signIn({
        email,
        password,
      });

      setAccessToken(response.accessToken);

      router.push("/notes");
    } catch {
      setErrorMessage("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <h1>로그인</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {errorMessage && <p>{errorMessage}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/signup")}
      >
        회원가입
      </button>
    </main>
  );
}
