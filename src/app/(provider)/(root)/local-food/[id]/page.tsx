'use client';

import supabase from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import FixedButtons from '../_components/FixedButtons';
import Loading from '@/components/common/Loading';
import { OrderDetail } from './_components/OrderDetail';
import { useState } from 'react';
import { DetailSlide } from './_components/DetailSlide';
import { CartModal } from './_components/CartModal';
import { DetailImage } from './_components/DetailImage';
import { Review } from './_components/Review';

type LocalDetailPageProps = {
  params: { id: string };
};

const LocalDetailPage = ({ params: { id } }: LocalDetailPageProps) => {
  const [openModal, setOpenModal] = useState(false); //바텀시트
  const [openCartModal, setOpenCartModal] = useState(false); //카트 담기 완료 모달
  const [activeTab, setActiveTab] = useState('상세 정보');

  const {
    data: food,
    isPending,
    error
  } = useQuery({
    queryKey: ['localfood', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_food')
        .select('*, reviews(*)')
        .eq('product_id', id)
        .single();

      if (error) throw new Error(error.message);

      return data;
    }
  });

  if (isPending) return <Loading />;
  if (error) return <div>오류 {error.message}</div>;

  const totalAmount =
    (food.price ?? 0) - (food.price ?? 0) * ((food.discountRate ?? 0) / 100);

  return (
    <div>
      {/* 슬라이드 */}
      <DetailSlide images={food.title_image} />

      {/* 상세 정보 */}
      <div className="m-4">
        <h2 className="text-xl font-semibold">
          {`[${food.location}] `}
          {food?.food_name}
        </h2>
        <p className="text-[#AFACA7] text-sm">{food.description}</p>
        <p className="text-label-normal text-sm mt-2">
          {`${food.discountRate}%`}
          <span className="inline-block ml-1 text-label-assistive line-through">{`${food.price?.toLocaleString()}원`}</span>
        </p>
        <p className="text-primary-20 font-bold text-xl">{`${totalAmount.toLocaleString()}원`}</p>
      </div>
      <div className="border-t-4 border-b-4 border-[#F2F2F2] w-full mt-4 p-4">
        <table className="text-left text-sm">
          <tbody>
            <tr>
              <th className="align-top text-primary-heavy font-medium w-16">
                배송
              </th>
              <td>
                향신배송
                <p className="text-[#76746d]">
                  23시 전 주문 시 내일 아침 8시 전 도착
                  <span className="block">
                    (제주도, 도서산간지역 향신배송 불가)
                  </span>
                </p>
              </td>
            </tr>
            <tr>
              <th className="text-primary-heavy font-medium py-2">배송비</th>
              <td>2,500원</td>
            </tr>
            <tr>
              <th className="text-primary-heavy font-medium">판매자</th>
              <td>향그리움</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-b-[2px] border-[#F2F2F2]">
        <ul className="flex text-center pt-4 font-semibold">
          <li
            className="flex-1 cursor-pointer"
            onClick={() => setActiveTab('상세 정보')}
          >
            <p
              className={`pb-2 w-[140px] mx-auto ${
                activeTab === '상세 정보'
                  ? 'text-primary-20 border-b-4 border-primary-20'
                  : 'text-label-assistive'
              }`}
            >
              상세 정보
            </p>
          </li>
          <li
            className="flex-1 cursor-pointer"
            onClick={() => setActiveTab('리뷰')}
          >
            <p
              className={`pb-2 w-[140px] mx-auto ${
                activeTab === '리뷰'
                  ? 'text-primary-20 border-b-4 border-primary-20'
                  : 'text-label-assistive'
              }`}
            >
              {`리뷰(${food.reviews.length})`}
            </p>
          </li>
        </ul>
      </div>

      {/* 상세 정보 */}
      {activeTab === '상세 정보' && <DetailImage food={food.food_image} />}

      {/* 리뷰 */}
      {activeTab === '리뷰' && <Review productId={food.product_id} />}

      {/* 장바구니 담기, 구매하기 */}
      <FixedButtons
        food={food}
        count={food.count}
        onPurchase={() => setOpenModal(true)}
        isModalOpen={openModal}
        handleCartModalOpen={() => setOpenCartModal(true)}
      />
      {openModal && (
        <div
          className="fixed inset-0 z-[999] bg-[rgba(0,0,0,.24)]"
          onClick={() => setOpenModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭해도 이벤트 발생 X
          >
            <OrderDetail
              params={{ id }}
              isModalOpen={openModal}
              onPurchase={() => setOpenModal(true)}
              handleCartModalOpen={() => setOpenCartModal(true)}
            />
          </div>
        </div>
      )}
      {openCartModal && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,.24)] z-[9999]"
          onClick={() => setOpenCartModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭해도 이벤트 발생 X
          >
            <CartModal handleCartModalClose={() => setOpenCartModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalDetailPage;
