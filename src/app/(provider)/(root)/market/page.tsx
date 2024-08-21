'use client';

import FilterButton from '@/components/ui/FilterButton';
import { MarketType, RegionData } from '@/types/Market';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight
} from 'react-icons/bs';
import { RiMoreLine } from 'react-icons/ri';
import MarketLikes from './_components/MarketLikes';
import { useUser } from '@/hooks/useUser';
import Loading from '@/components/common/Loading';
import MarketImage from './_components/MarketImage';
import { LuDot } from 'react-icons/lu';

const MarketPage = () => {
  const { data: user, isLoading, error } = useUser();
  const [markets, setMarkets] = useState<MarketType[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const [activeSmallFilter, setActiveSmallFilter] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedLargeRegion, setSelectedLargeRegion] = useState('전체');
  const [selectedSmallRegion, setSelectedSmallRegion] = useState('');

  // 시장 데이터 불러오는 API
  const fetchMarkets = async (page: number) => {
    let url = '';
    if (selectedLargeRegion === '전체') {
      url = `/api/market/list?page=${page}`;
    } else {
      url = `/api/market/filter-list?page=${page}&largeRegion=${encodeURIComponent(
        selectedLargeRegion
      )}`;
      if (selectedSmallRegion) {
        url += `&smallRegion=${encodeURIComponent(selectedSmallRegion)}`;
      }
    }
    try {
      const response = await fetch(url);
      const { data, totalPages } = await response.json();
      setMarkets(data);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('데이터를 가져오지 못했습니다.', error);
    }
  };
  // console.log('markets____', markets);
  // console.log('totalPages____', totalPages);

  // 필터
  const regionData: RegionData = {
    전체: ['전체'],
    서울: ['서울'],
    경기: ['경기'],
    인천: ['인천'],
    강원: ['강원'],
    충청: ['전체', '충북', '충남', '대전', '세종'],
    경상: ['전체', '경북', '경남', '대구', '부산', '울산'],
    전라: ['전체', '전북', '전남', '광주'],
    제주: ['제주']
  };

  const largeRegions = Object.keys(regionData);
  const regionWithSmall = ['충청', '경상', '전라'];

  useEffect(() => {
    fetchMarkets(currentPage);
  }, [currentPage, selectedLargeRegion, selectedSmallRegion]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  const handleLargeRegionChange = (region: string) => {
    setSelectedLargeRegion(region);
    setActiveFilter(region);
    setSelectedSmallRegion('');
    setCurrentPage(1);
  };

  const handleSmallRegionChange = (region: string) => {
    if (region === '전체') {
      setSelectedSmallRegion('');
    } else {
      setSelectedSmallRegion(region);
    }
    setActiveSmallFilter(region);
    setCurrentPage(1);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {/* 데스크탑 */}
      <div className="hidden md:block">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-center">
            <Image
              src={
                'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/markets/market-banner(L).svg'
              }
              width={1280}
              height={280}
              priority
              alt="시장배너이미지"
              className="w-full h-auto max-w-[1280px] max-h-[280px] mt-24 mb-8 object-cover items-center"
              sizes="100vw"
            />
          </div>
          <div className="flex gap-4 border-b-[1px] border-[#E0E0E0]">
            {largeRegions.map((region) => (
              <div key={region} className="flex flex-col">
                <button
                  onClick={() => handleLargeRegionChange(region)}
                  className={`h-[46px] text-nowrap text-base font-medium pt-2 px-4 pb-3 ${
                    activeFilter === region
                      ? 'text-primary-20 '
                      : 'text-label-alternative'
                  }`}
                >
                  {region}
                </button>
                <div
                  className={`flex ${
                    activeFilter === region
                      ? 'border-b-4 border-primary-20'
                      : ''
                  }`}
                />
              </div>
            ))}
          </div>
          {regionWithSmall.includes(selectedLargeRegion) && (
            <div className="flex pt-4 pb-2 gap-3">
              {regionData[selectedLargeRegion].map((small) => (
                <button
                  key={small}
                  onClick={() => handleSmallRegionChange(small)}
                  className={`text-nowrap text-base font-medium px-4 py-[6px] rounded-[4px] ${
                    activeSmallFilter === small
                      ? 'text-label-light bg-secondary-20'
                      : 'text-label-strong bg-secondary-60'
                  }`}
                >
                  {small}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모바일 */}
      <div className="block md:hidden">
        <div className="flex overflow-auto scrollbar-hide gap-2 px-4 pt-2 mt-16 mb-4 border-b-[1px] border-[#E0E0E0]">
          {largeRegions.map((region) => (
            <div key={region} className="flex flex-col">
              <button
                onClick={() => handleLargeRegionChange(region)}
                className={`h-[46px] text-nowrap text-base font-medium pt-2 px-4 pb-3 ${
                  activeFilter === region
                    ? 'text-primary-20 '
                    : 'text-label-alternative'
                }`}
              >
                {region}
              </button>
              <div
                className={`flex ${
                  activeFilter === region ? 'border-b-4 border-primary-20' : ''
                }`}
              />
            </div>
          ))}
        </div>
        {regionWithSmall.includes(selectedLargeRegion) && (
          <div className="flex overflow-auto scrollbar-hide px-4 pb-4 gap-2">
            {regionData[selectedLargeRegion].map((small) => (
              <button
                key={small}
                onClick={() => handleSmallRegionChange(small)}
                className={`text-nowrap text-base font-medium px-4 py-[6px] rounded-[4px] ${
                  activeSmallFilter === small
                    ? 'text-label-light bg-secondary-20'
                    : 'text-label-strong bg-secondary-60'
                }`}
              >
                {small}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full px-4 mb-6 md:max-w-[1280px] md:mx-auto md:p-0">
        <div className="justify-center place-content-center ">
          <Image
            src={
              'https://kejbzqdwablccrontqrb.supabase.co/storage/v1/object/public/markets/market-banner(S).svg'
            }
            width={343}
            height={80}
            priority
            alt="시장배너이미지"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            className="block md:hidden"
          />

          <div className="flex flex-col mt-4 gap-5 md:m-0 md:gap-0 w-full">
            {loading ? (
              <p>로딩중...</p>
            ) : (
              markets?.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col md:flex-row md:items-center md:border-b md:border-primary-60 md:mb-2"
                >
                  <div className="w-full py-3 px-3 rounded-xl border border-solid border-secondary-50 bg-white md:bg-normal md:border-none md:p-0">
                    <Link href={`/market/${item.id}`} className="w-full">
                      <div className="w-full flex flex-col md:justify-center md:items-center md:flex-row md:pt-8 md:pb-10">
                        <div className="hidden md:flex justify-center items-center w-11 h-9 p-1 mr-12 bg-primary-20 text-label-light text-xs rounded-[8px]">
                          {item.id}
                        </div>
                        <div className="md:my-[2.5px] md:py-1 md:mr-4">
                          <div className="flex justify-between">
                            <p className="pl-1 text-base font-semibold text-label-strong md:text-xl md:font-semibold md:p-0">
                              {item.시장명}
                            </p>

                            {/* 여기 하트는 sm에서만 보이게 */}
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="block md:hidden"
                            >
                              <MarketLikes
                                pixel={5}
                                userId={user?.id}
                                marketId={item.id}
                              />
                            </div>
                          </div>
                          <p
                            className="w-[283px] mb-2 pl-1 text-sm text-label-alternative text-ellipsis overflow-hidden whitespace-nowrap md:w-[280px] md:text-label-normal 
                          md:text-base md:font-normal md:p-0 md:mt-1 md:mb-10"
                          >
                            {item.도로명주소}
                          </p>
                          <div className="hidden md:flex flex-col mb-0 gap-1">
                            <div className="flex justify-around w-[172px] ">
                              <LuDot className="text-primary-20" />
                              <div className="text-sm font-normal mr-auto text-label-normal ">
                                고객 전용 주차장
                              </div>
                              <div className="text-sm font-medium text-label-strong">
                                {item.시장전용고객주차장_보유여부 === 'Y' ? (
                                  <div>보유　</div>
                                ) : (
                                  '미보유'
                                )}
                              </div>
                            </div>
                            <div className="flex justify-around w-[172px] ">
                              <LuDot className="text-primary-20" />
                              <span className="text-sm font-normal mr-auto text-label-normal">
                                고객 휴게실
                              </span>
                              <span className="text-sm font-medium text-label-strong">
                                {item.고객휴게실_보유여부 === 'Y' ? (
                                  <div>보유　</div>
                                ) : (
                                  '미보유'
                                )}
                              </span>
                            </div>
                            <div className="flex justify-around w-[172px]">
                              <LuDot className="text-primary-20" />
                              <span className="text-sm mr-auto text-label-normal">
                                물품 보관함
                              </span>
                              <span className="text-sm font-medium text-label-strong">
                                {item.물품보관함_보유여부 === 'Y' ? (
                                  <div>보유　</div>
                                ) : (
                                  '미보유'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        {item.이미지 ? (
                          <>
                            <div className="relative flex gap-2 md:hidden">
                              {item.이미지.slice(0, 2).map((imgSrc, index) => (
                                <div
                                  key={index}
                                  className={
                                    'rounded-[8px] relative w-full h-[130px]'
                                  }
                                >
                                  <MarketImage
                                    src={imgSrc}
                                    alt={`${item.시장명} - 이미지 ${index + 1}`}
                                    sizes="(max-width: 768px) 100vw, 343px"
                                    className={`absolute w-full h-full ${
                                      index === 0
                                        ? 'rounded-l-[8px] rounded-r-none'
                                        : 'rounded-r-[8px] rounded-l-none'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="hidden w-full relative md:flex md:gap-3">
                              {item.이미지.slice(0, 3).map((imgSrc, index) => (
                                <div
                                  key={index}
                                  className={
                                    'rounded-[8px] relative md:w-1/3 md:h-[180px]'
                                  }
                                >
                                  <MarketImage
                                    src={imgSrc}
                                    alt={`${item.시장명} - 이미지 ${index + 1}`}
                                    sizes="(max-width: 1280px) 100vw, 343px"
                                    className={`absolute w-full h-full ${
                                      index === 0
                                        ? 'rounded-l-[8px] rounded-r-none'
                                        : index === 2
                                        ? 'rounded-r-[8px] rounded-l-none'
                                        : 'rounded-none'
                                    }`}
                                  />
                                </div>
                              ))}
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                className="hidden absolute right-3 top-5 md:flex justify-center items-center w-9 h-9 rounded-full bg-black bg-opacity-40"
                              >
                                <MarketLikes
                                  pixel={5}
                                  userId={user?.id}
                                  marketId={item.id}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <p style={{ color: 'red' }}>Error: {item.error}</p>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center mb-56 md:max-w-[860px] md:w-full md:mx-auto md:mt-20 md:px">
        <div className="flex flex-row">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-4 py-1 ${
              currentPage === 1
                ? 'text-[#AFAFAF] cursor-not-allowed'
                : 'text-[#545454]'
            }`}
          >
            <div className="hidden md:flex gap-[6px] place-items-center">
              <BsChevronDoubleLeft className="w-4 h-4 " />
              <p
                className={`hidden md:block font-medium text-[15px] ${
                  currentPage === 1
                    ? 'text-[#AFAFAF] cursor-not-allowed'
                    : 'text-[15px] text-label-strong'
                }`}
              >
                처음
              </p>
            </div>
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-1 ${
              currentPage === 1
                ? 'text-[#AFAFAF] cursor-not-allowed'
                : 'text-[#545454]'
            }`}
          >
            <div className="flex gap-6 place-items-center font-medium">
              <div className="flex gap-[6px] place-items-center">
                <BsChevronLeft className="w-4 h-4" />
                <p
                  className={`hidden md:block font-medium text-[15px] ${
                    currentPage === 1
                      ? 'text-[#AFAFAF] cursor-not-allowed'
                      : 'text-[15px] text-label-strong'
                  }`}
                >
                  이전
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="flex space-x-2 md:space-x-4">
          {/* 앞의 1, 2, 3 페이지 */}
          {currentPage <= 3 && (
            <>
              {[...Array(Math.min(totalPages, 3))].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`py-1 gap-[2px] font-medium text-[15px] text-label-alternative text-center w-10 h-10 md:gap-4 ${
                    currentPage === index + 1 &&
                    'border border-solid rounded-[8px] text-primary-20 border-primary-20'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {totalPages > 4 && (
                <>
                  <div className="flex gap-[6px] place-items-center md:gap-8">
                    <RiMoreLine className="w-4 h-4 text-[#838383]" />
                  </div>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`py-1 gap-[2px]  font-medium text-[15px] text-label-alternative text-center w-10 h-10 ${
                      currentPage === totalPages &&
                      'border border-solid rounded-[8px] text-primary-20 border-primary-20'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </>
          )}

          {/* 중간 페이지 */}
          {currentPage > 3 && currentPage < totalPages - 2 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`py-1 gap-[2px]  font-medium text-[15px] text-label-alternative text-center w-10 h-10`}
              >
                1
              </button>
              <div className="flex gap-[6px] place-items-center">
                <RiMoreLine className="w-4 h-4 text-[#838383]" />
              </div>

              {[currentPage - 1, currentPage, currentPage + 1].map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`py-1 gap-[2px]  font-medium text-[15px] text-label-alternative text-center w-10 h-10 ${
                      currentPage === pageNumber &&
                      'border border-solid rounded-[8px] text-primary-20 border-primary-20'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <div className="flex gap-[6px] place-items-center">
                <RiMoreLine className="w-4 h-4 text-[#838383]" />
              </div>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`py-1 gap-[2px] font-medium text-[15px] text-label-alternative text-center w-10 h-10 ${
                  currentPage === totalPages &&
                  'border border-solid rounded-[8px]  text-primary-20 border-primary-20'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* 마지막 페이지로 가는 경우 */}
          {currentPage >= totalPages - 2 && currentPage > 3 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className={`py-1 gap-[2px]  font-medium text-[15px] text-label-alternative text-center w-10 h-10`}
              >
                1
              </button>
              <div className="flex gap-[6px] place-items-center">
                <RiMoreLine className="w-4 h-4 text-[#838383]" />
              </div>

              {[...Array(3)].map((_, index) => {
                const pageNumber = totalPages - 2 + index;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`py-1 gap-[2px]  font-medium text-[15px] text-label-alternative text-center w-10 h-10 ${
                      currentPage === pageNumber &&
                      'border border-solid rounded-[8px] text-primary-20 border-primary-20'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </>
          )}
        </div>
        <div className="flex flex-row">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-1 ${
              currentPage === totalPages
                ? 'text-[#AFAFAF] cursor-not-allowed'
                : 'text-[#545454]'
            }`}
          >
            <div className="flex gap-6 place-items-center font-medium">
              <div className="flex gap-[6px] place-items-center">
                <p
                  className={`hidden md:block text-[15px] font-medium ${
                    currentPage === totalPages
                      ? 'text-[#AFAFAF] cursor-not-allowed'
                      : 'text-[15px] text-label-strong'
                  }`}
                >
                  다음
                </p>
                <BsChevronRight className="w-4 h-4" />
              </div>
            </div>
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-4 py-1 ${
              currentPage === totalPages
                ? 'text-[#AFAFAF] cursor-not-allowed'
                : 'text-[#545454]'
            }`}
          >
            <div className="hidden md:flex gap-[6px] place-items-center font-medium">
              <p
                className={`hidden md:block font-medium text-[15px] ${
                  currentPage === totalPages
                    ? 'text-[#AFAFAF] cursor-not-allowed'
                    : 'text-[15px] text-label-strong'
                }`}
              >
                마지막
              </p>
              <BsChevronDoubleRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MarketPage;
