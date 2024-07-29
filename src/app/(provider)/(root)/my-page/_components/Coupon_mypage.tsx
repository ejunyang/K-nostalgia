import { useRouter } from 'next/navigation';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { PiTicketLight } from 'react-icons/pi';

const Coupon_mypage = () => {
  const router = useRouter();

  const handleCouponClick = () => {
    router.push('/coupon-page');
  };

  return (
    <div className="p-4">
      <div className="flex items-center py-[3px]">
        <PiTicketLight className="mr-[8px] text-label-normal text-[20px]" />
        <span className="text-[16px]"> 할인 쿠폰 </span>
        <BsChevronRight
          className="ml-auto text-[#545454] cursor-pointer"
          onClick={handleCouponClick}
        />
      </div>
    </div>
  );
};

export default Coupon_mypage;