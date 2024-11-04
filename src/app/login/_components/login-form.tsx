"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { LoginFormSchema } from "../const";
import { LoginInputs } from "../type";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    resolver: zodResolver(LoginFormSchema), // Zod 스키마를 통한 유효성 검사
  });

  const onSubmit = async (data: LoginInputs) => {
    try {
      await login(data);
      window.location.href = "/";
    } catch {
      setError("root", { message: "아이디와 비밀번호를 확인해주세요." });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Login</legend>
        <div className="my-4">
          <label htmlFor="username">아이디</label>
          <input
            className="ml-2"
            type="text"
            id="username"
            {...register("username")}
          />
          {errors.username && (
            <p className={`${errors.username ? "text-red-600" : ""}`}>
              {errors.username.message}
            </p>
          )}
        </div>
        <div className={`${errors.password ? "text-red-600" : ""} my-4`}>
          <label htmlFor="password">비밀번호</label>
          <input
            className="ml-2"
            type="password"
            id="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {errors.root && (
          <p className={`${errors.root ? "text-red-600" : ""} my-4`}>
            {errors.root.message}
          </p>
        )}
        <div className="flex flex-col">
          <button
            type="submit"
            disabled={isSubmitting}
            className="disabled:text-gray-500 bg-yellow-300 mb-4 p-4 rounded-lg"
          >
            로그인
          </button>
          <Link href="/signup" className="bg-yellow-300 mb-4 p-4 rounded-lg">
            회원가입
          </Link>
        </div>
      </fieldset>
    </form>
  );
}
