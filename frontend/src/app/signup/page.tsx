"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { checkEmail, signUp } from "@/lib/auth";
import { getAccessToken } from "@/lib/auth-storage";
import { ApiError } from "@/lib/api";

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

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    if (getAccessToken()) {
      router.replace("/notes");
    }
  }, [router]);

  const handleEmailChange = (value: string) => {
    setEmail(value);

    setIsEmailChecked(false);
    setIsEmailAvailable(false);
    setEmailMessage("");
  };

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      setErrorMessage("");

      const response = await checkEmail(email);

      setIsEmailChecked(true);
      setIsEmailAvailable(response.available);

      if (response.available) {
        setEmailMessage("사용 가능한 이메일입니다.");
      } else {
        setEmailMessage("이미 사용 중인 이메일입니다.");
      }
    } catch (error) {
      setIsEmailChecked(false);
      setIsEmailAvailable(false);

      if (error instanceof ApiError && error.field === "email") {
        setEmailMessage(error.message);
        return;
      }

      setEmailMessage("이메일 중복 확인에 실패했습니다.");
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("이름을 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (!isEmailChecked) {
      setErrorMessage("이메일 중복 확인을 해주세요.");
      return;
    }

    if (!isEmailAvailable) {
      setErrorMessage("사용 가능한 이메일을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await signUp({
        name,
        email,
        password,
      });

      alert("회원가입이 완료되었습니다.");

      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>회원가입</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">이름</label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">이메일</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              handleEmailChange(event.target.value)
            }
            required
          />

          <button type="button" onClick={handleCheckEmail}>
            중복 확인
          </button>

          {emailMessage && <p>{emailMessage}</p>}
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </main>
  );
}
