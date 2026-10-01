"use client";

import {type FormEvent, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

import {signIn} from "@/lib/auth";
import {getAccessToken, setAccessToken,} from "@/lib/auth-storage";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (getAccessToken()) {
            router.replace("/dashboard");
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

            router.push("/dashboard");
        } catch {
            setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
            <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Memory Calendar
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        일정과 할 일을 간편하게 관리하세요.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            이메일
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="example@email.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-zinc-700"
                        >
                            비밀번호
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="비밀번호"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="text-zinc-500">
            계정이 없나요?
          </span>

                    <button
                        type="button"
                        onClick={() => router.push("/signup")}
                        className="font-medium text-zinc-900 hover:underline"
                    >
                        회원가입
                    </button>
                </div>
            </section>
        </main>
    );
}