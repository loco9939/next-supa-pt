"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { checkUsernameAvailability, signup } from "../actions";
import { SignupFormSchema } from "../const";
import { SignupInputs } from "../type";
import Postcode from "./Postcode";

export default function SignupForm() {
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    null | boolean
  >(null);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>({
    resolver: zodResolver(SignupFormSchema),
  });

  const usernameValue = watch("username"); // username 필드의 변화를 감지

  const onSubmit = async (data: SignupInputs) => {
    // 중복 확인을 하지 않았거나 아이디가 사용 불가능한 경우
    if (isUsernameAvailable === null) {
      setError("username", { message: "아이디 중복 확인을 해주세요." });
      return;
    }

    if (!isUsernameAvailable) {
      setError("username", {
        message: "이미 사용 중인 아이디입니다. 다른 아이디를 입력하세요.",
      });
      return;
    }

    // 중복 확인 통과 시 회원가입 진행
    await signup(data);
  };

  const onCheckUsername = async () => {
    const res = await checkUsernameAvailability(getValues("username"));
    setIsUsernameAvailable(res.isAvailable);
    clearErrors("username");
  };

  useEffect(() => {
    // username 값이 변경될 때마다 중복 확인 상태를 초기화
    setIsUsernameAvailable(null);
    clearErrors("username");
  }, [usernameValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-black p-8">
        <legend>Sign Up</legend>
        <div className={`${errors.username ? "text-red-600" : ""} my-4`}>
          <label htmlFor="username">아이디</label>
          <input
            className="ml-2"
            type="text"
            id="username"
            {...register("username")}
          />
          <button
            type="button"
            className="disabled:text-gray-500 bg-yellow-300 ml-4 p-2 rounded-lg"
            onClick={onCheckUsername}
          >
            중복확인
          </button>
          {errors.username && <p>{errors.username.message}</p>}
          {isUsernameAvailable !== null && (
            <p>
              {isUsernameAvailable
                ? "사용 가능한 아이디입니다."
                : "이미 사용 중인 아이디입니다."}
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
        <div className={`${errors.confirmPassword ? "text-red-600" : ""} my-4`}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            className="ml-2"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div className={`${errors.email ? "text-red-600" : ""} my-4`}>
          <label htmlFor="email">이메일</label>
          <input
            className="ml-2"
            type="text"
            id="email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className={`${errors.phone ? "text-red-600" : ""} my-4`}>
          <label htmlFor="phone">전화번호</label>
          <input
            className="ml-2"
            type="tel"
            id="phone"
            {...register("phone")}
          />
          {errors.phone && <p>{errors.phone.message}</p>}
        </div>
        <Postcode register={register} setValue={setValue} errors={errors} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="disabled:text-gray-500 bg-yellow-300 mb-4 p-4 rounded-lg"
        >
          회원가입
        </button>
      </fieldset>
    </form>
  );
}
