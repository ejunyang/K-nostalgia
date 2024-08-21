'use client';

import { useUser } from '@/hooks/useUser';
import supabase from '@/utils/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Image from 'next/image';
import { StarRating } from './StarRating';
import Loading from '@/components/common/Loading';
import Swal from 'sweetalert2';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationLink,
  PaginationPrevious
} from '@/components/ui/pagination';
import { RiArrowLeftDoubleFill, RiArrowRightDoubleFill } from 'react-icons/ri';
import useDeviceSize from '@/hooks/useDeviceSize';

type UserType = {
  name: string;
  avatar: string;
};

export type ReviewType = {
  review_id: string;
  created_at: string;
  product_id: string;
  user_id: string;
  content: string;
  rating: number;
  users?: UserType;
};

type ReviewDataType = {
  reviews: ReviewType[];
  totalPages: number;
  totalReviews: number;
};

export const Review = ({ productId }: { productId: string }) => {
  const { data: userData } = useUser();
  const queryClient = useQueryClient();
  const { isDesktop } = useDeviceSize();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const fetchReview = async (page: number) => {
    const response = await fetch(
      `/api/review?product_id=${productId}&page=${page}&limit=${limit}`
    );
    const data = await response.json();
    return data;
  };

  const {
    data: reviewData,
    error,
    isPending
  } = useQuery<ReviewDataType>({
    queryKey: ['reviews', productId, currentPage],
    queryFn: () => fetchReview(currentPage)
  });

  const mutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('review_id', reviewId);
      if (error) {
        throw new Error('리뷰를 삭제하지 못했습니다.' + error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reviews', productId]
      });
    }
  });

  if (isPending) return <Loading />;
  if (error) return <div>오류</div>;

  const totalRate = reviewData.reviews.reduce(
    (acc, item) => acc + (item.rating ?? 0),
    0
  );
  const averageRate = (totalRate ?? 0) / (reviewData?.reviews.length || 1);

  const handleReviewDelete = (reviewId: string) => {
    Swal.fire({
      title: '리뷰를 삭제하시겠어요?',
      html: `
      <div id="swal2-html-container" class="swal2-html-container" style=" padding:0 !important; margin:-1rem; font-size:16px;">삭제 후에는 복구가 불가해요</div>
    `,
      showCancelButton: true,
      cancelButtonColor: '#9C6D2E',
      confirmButtonColor: '#f2f2f2',
      cancelButtonText: '취소하기',
      confirmButtonText: '삭제하기',
      customClass: {
        title: 'text-xl mt-10 md:mb-[8px]',
        popup: 'rounded-[16px]',
        actions: 'flex gap-3 mb-6 mt-9 md:mt-[40px] md:mb-[28px]',
        confirmButton:
          'text-status-negative py-3 px-4 rounded-[12px] w-[138px] m-0',
        cancelButton: 'text-white py-3 px-4 rounded-[12px] w-[138px] m-0'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(reviewId);
      }
    });
  };

  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) => {
    e.preventDefault();
    setCurrentPage(page);
  };

  return (
    <section className="pb-32 md:pb-20 flex flex-col justify-center items-center">
      {/* 별점 */}
      <div className="border-b-2 border-[#F2F2F2] w-full">
        <div className="w-[235px] my-8 mx-auto flex items-center justify-center border border-[##E0E0E0] bg-white rounded-[8px] p-4">
          <p className="mr-4 font-semibold">
            {averageRate.toFixed(1)}{' '}
            <span className="text-label-alternative"> / 5</span>
          </p>
          <StarRating rating={averageRate} size={24} />
        </div>
      </div>

      {/* 리뷰목록 */}
      <ul className="mt-8 w-full">
        {reviewData.reviews && reviewData.reviews.length > 0 ? (
          reviewData?.reviews.map((review) => (
            <li
              key={review.review_id}
              className="border-b-2 border-[#F2F2F2] py-3"
            >
              <div className="px-4">
                <div className="flex justify-between items-start mb-2">
                  {review.users && (
                    <Image
                      src={review.users?.avatar || ''}
                      width={48}
                      height={48}
                      alt={`프로필 이미지`}
                      className="rounded-full mr-2"
                    />
                  )}

                  <div className="flex-1">
                    <p className="text-label-strong font-semibold">
                      {review.users?.name}
                      <span className="inline-block pl-2 text-label-assistive font-normal text-sm">
                        {dayjs(review.created_at)
                          .locale('ko')
                          .format('YYYY. MM. DD')}
                      </span>
                    </p>
                    <StarRating rating={review.rating} size={20} />
                  </div>

                  {userData?.id === review.user_id && (
                    <button
                      onClick={() => handleReviewDelete(review.review_id)}
                      className="text-label-normal font-normal text-sm"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="py-1 text-label-strong text-[15px] font-normal">
                  {review.content}
                </div>
              </div>
            </li>
          ))
        ) : (
          <>
            <Image
              src={'/image/StateSad.png'}
              width={113}
              height={96}
              alt="default"
              className="mx-auto"
            />
            <p className="text-label-assistive text-lg mt-4 font-medium text-center">
              작성된 리뷰가 없어요
            </p>
          </>
        )}
      </ul>

      {/* 작성된 리뷰가 없을 경우 페이지네이션 숨김처리 */}
      {reviewData.reviews && reviewData.reviews.length > 0 && (
        <Pagination
          className={`${
            isDesktop ? 'mb-0' : 'mb-[5rem]'
          } max-w-screen-xl mx-auto`}
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                onClick={(e) => handlePageChange(e, currentPage - 1)}
              >
                <button className="hover:text-label-strong transition-all duration-300 ease-in-out flex items-center gap-[6px] text-label-assistive text-[15px]">
                  <RiArrowLeftDoubleFill />
                  처음
                </button>
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) =>
                  currentPage > 1 && handlePageChange(e, currentPage - 1)
                }
              />
            </PaginationItem>
            {Array.from({ length: reviewData.totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageChange(e, index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={(e) =>
                  currentPage < reviewData.totalPages &&
                  handlePageChange(e, currentPage + 1)
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={(e) => handlePageChange(e, reviewData.totalPages)}
              >
                <button className="hover:text-label-strong transition-all duration-300 ease-in-out flex items-center gap-[6px] text-label-assistive text-[15px]">
                  마지막
                  <RiArrowRightDoubleFill />
                </button>
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
};
