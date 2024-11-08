declare namespace daum {
  export type PostcodeResult = {
    address: string;
    zonecode: string;
  };

  export class Postcode {
    constructor({ oncomplete }: { oncomplete: (data: PostcodeResult) => void });

    open();
  }
}
