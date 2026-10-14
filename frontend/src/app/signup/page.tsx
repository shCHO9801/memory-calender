"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";
import {useRouter} from "next/navigation";

import {ApiError} from "@/lib/api";
import {checkEmail, signUp} from "@/lib/auth";
import {
  getAccessToken,
  isAccessTokenExpired,
  removeAccessToken,
} from "@/lib/auth-storage";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailChecked, setIsEmailChecked] =
      useState(false);

  const [isEmailAvailable, setIsEmailAvailable] =
      useState(false);

  const [emailMessage, setEmailMessage] =
      useState("");

  const [errorMessage, setErrorMessage] =
      useState("");

  const [isCheckingEmail, setIsCheckingEmail] =
      useState(false);

  const [isSubmitting, setIsSubmitting] =
      useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      return;
    }

    if (isAccessTokenExpired(token)) {
      removeAccessToken();
      return;
    }

    router.replace("/dashboard");
  }, [router]);

  const handleEmailChange = (
      value: string,
  ) => {
    setEmail(value);

    setIsEmailChecked(false);
    setIsEmailAvailable(false);
    setEmailMessage("");
  };

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setEmailMessage(
          "이메일을 입력해주세요.",
      );
      return;
    }

    try {
      setIsCheckingEmail(true);
      setErrorMessage("");

      const response =
          await checkEmail(email.trim());

      setIsEmailChecked(true);
      setIsEmailAvailable(
          response.available,
      );

      setEmailMessage(
          response.available
              ? "사용 가능한 이메일입니다."
              : "이미 사용 중인 이메일입니다.",
      );
    } catch (error) {
      setIsEmailChecked(false);
      setIsEmailAvailable(false);

      if (
          error instanceof ApiError &&
          error.field === "email"
      ) {
        setEmailMessage(error.message);
        return;
      }

      setEmailMessage(
          "이메일 중복 확인에 실패했습니다.",
      );
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (
      event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage(
          "이름을 입력해주세요.",
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage(
          "이메일을 입력해주세요.",
      );
      return;
    }

    if (!password) {
      setErrorMessage(
          "비밀번호를 입력해주세요.",
      );
      return;
    }

    if (!isEmailChecked) {
      setErrorMessage(
          "이메일 중복 확인을 해주세요.",
      );
      return;
    }

    if (!isEmailAvailable) {
      setErrorMessage(
          "사용 가능한 이메일을 입력해주세요.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(
            error.message,
        );
        return;
      }

      setErrorMessage(
          "회원가입에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8">
        <section className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Memory Calendar
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              새로운 계정을 만들어 시작하세요.
            </p>
          </div>

          <form
              onSubmit={handleSubmit}
              className="space-y-5"
          >
            <div>
              <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-zinc-700"
              >
                이름
              </label>

              <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                      setName(
                          event.target.value,
                      )
                  }
                  placeholder="이름"
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500"
              />
            </div>

            <div>
              <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700"
              >
                이메일
              </label>

              <div className="flex gap-2">
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        handleEmailChange(
                            event.target
                                .value,
                        )
                    }
                    placeholder="example@email.com"
                    autoComplete="email"
                    required
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-500"
                />

                <button
                    type="button"
                    onClick={() => {
                      void handleCheckEmail();
                    }}
                    disabled={
                        isCheckingEmail ||
                        !email.trim()
                    }
                    className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCheckingEmail
                      ? "확인 중..."
                      : "중복 확인"}
                </button>
              </div>

              {emailMessage && (
                  <p
                      className={`mt-2 text-sm ${
                          isEmailChecked &&
                          isEmailAvailable
                              ? "text-emerald-600"
                              : "text-red-500"
                      }`}
                  >
                    {emailMessage}
                  </p>
              )}
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
                  onChange={(event) =>
                      setPassword(
                          event.target.value,
                      )
                  }
                  placeholder="비밀번호"
                  autoComplete="new-password"
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
                disabled={isSubmitting}
                className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                  ? "가입 중..."
                  : "회원가입"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                    <span className="text-zinc-500">
                        이미 계정이 있나요?
                    </span>

            <button
                type="button"
                onClick={() =>
                    router.push("/login")
                }
                className="font-medium text-zinc-900 hover:underline"
            >
              로그인
            </button>
          </div>
        </section>
      </main>
  );
}