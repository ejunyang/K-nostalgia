import Image from 'next/image';
import React from 'react';

interface textProps {
  text: string;
}

export const DefaultImage = ({ text }: textProps) => {
  return (
    <div className="flex flex-col justify-center items-center text-center absolute translate-x-[-60%] translate-y-[-50%] top-[60%] left-[50%]">
      <Image
        src="/image/StateSad.png"
        width={100}
        height={92}
        priority
        alt={`${text}`}
        style={{ width: 100, height: 92 }}
      />
      <p className="text-label-assistive text-lg mt-4 font-medium">{text}</p>
    </div>
  );
};
