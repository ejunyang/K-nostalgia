'use client';

import DefaultAppLayout from '@/components/common/DefaultAppLayout';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';

function LocalFoodLayout({ children }: PropsWithChildren) {
  // TODO 조건부 TODO use client 쓰는 방법밖에 없는지 한 번 더 생각해보기
  const pathLocalName: string = usePathname();
  const showLocalFoodNavigation =
    pathLocalName === '/local-food' ||
    !pathLocalName.startsWith('/local-food/');

  return (
    <DefaultAppLayout
      showHeader={true}
      showNavigation={showLocalFoodNavigation}
      headerTitle="특산물"
    >
      {children}
    </DefaultAppLayout>
  );
}

export default LocalFoodLayout;
