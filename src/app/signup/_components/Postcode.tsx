// "use client";

// import { useForm } from "react-hook-form";

// type PostcodeInputs = {
//   postalCode: string;
//   address: string;
//   detailAddress?: string;
// };

// export default function Postcode() {
//   const { register, setValue } = useForm<PostcodeInputs>();

//   const handleOpen = () => {
//     new daum.Postcode({
//       oncomplete(data) {
//         const { address, zonecode: postalCode } = data;
//         setValue("address", address);
//         setValue("postalCode", postalCode);
//         close();
//       },
//     }).open();
//   };

//   return (
//     <div>
//       <div className="text-left">
//         <input
//           type="text"
//           readOnly
//           id="sample4_postcode"
//           placeholder="우편번호"
//           {...register("postalCode")}
//         />
//         <button
//           className="disabled:text-gray-500 bg-yellow-300 mb-4 p-2 ml-2 rounded-lg"
//           type="button"
//           onClick={handleOpen}
//         >
//           우편번호 찾기
//         </button>
//       </div>
//       <div className="text-left">
//         <input
//           type="text"
//           id="sample4_roadAddress"
//           placeholder="도로명주소"
//           className="w-[100%]"
//           readOnly
//           {...register("address")}
//         />
//       </div>
//       <div className="text-left my-4">
//         <input
//           type="text"
//           id="sample4_detailAddress"
//           placeholder="상세주소"
//           className="w-[100%]"
//           {...register("detailAddress")}
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SignupInputs } from "../type";

type PostcodeProps = {
  register: UseFormRegister<SignupInputs>;
  setValue: UseFormSetValue<SignupInputs>;
  errors: FieldErrors<SignupInputs>;
};

export default function Postcode({
  register,
  setValue,
  errors,
}: PostcodeProps) {
  const handleOpen = () => {
    new daum.Postcode({
      oncomplete(data) {
        const { address, zonecode: postalCode } = data;
        setValue("address", address);
        setValue("postalCode", postalCode);
      },
    }).open();
  };

  return (
    <>
      <div className="text-left">
        <input
          type="text"
          readOnly
          id="postalCode"
          placeholder="우편번호"
          {...register("postalCode")}
        />
        <button
          className="disabled:text-gray-500 bg-yellow-300 mb-4 p-2 ml-2 rounded-lg"
          type="button"
          onClick={handleOpen}
        >
          우편번호 찾기
        </button>
        {errors.postalCode && (
          <p className={errors.postalCode ? "text-red-600" : ""}>
            {errors.postalCode.message}
          </p>
        )}
      </div>
      <div className="text-left">
        <input
          type="text"
          id="address"
          placeholder="도로명주소"
          className="w-[100%]"
          readOnly
          {...register("address")}
        />
        {errors.address && (
          <p className={errors.address ? "text-red-600" : ""}>
            {errors.address.message}
          </p>
        )}
      </div>
      <div className="text-left my-4">
        <input
          type="text"
          id="detailAddress"
          placeholder="상세주소"
          className="w-[100%]"
          {...register("detailAddress")}
        />
      </div>
    </>
  );
}
