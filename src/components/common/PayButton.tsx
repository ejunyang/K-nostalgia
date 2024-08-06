'use client';

import api from '@/service/service';
import { Tables } from '@/types/supabase';
import PortOne from '@portone/browser-sdk/v2';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { usePathname, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '../ui/use-toast';

export type Products = {
  name: string | null;
  amount: number;
  quantity: number;
  id?: string | undefined;
}[];

interface Props {
  orderNameArr: (string | null)[];
  product: Products;
}

const PayButton = ({ orderNameArr, product }: Props) => {
  const router = useRouter();
  const pathName = usePathname();
  const products = product.map((prev) => ({ ...prev, id: uuidv4() }));

  const date = dayjs(new Date(Date.now())).locale('ko').format('YYMMDD');
  const newPaymentId = `${date}-${uuidv4().slice(0, 13)}`;

  const deliveryCharge: number = 2500;
  const discount: number = 2000;
  const price: number = products.reduce((acc, item) => acc + item.amount, 0);

  const totalQuantity = product.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = price + deliveryCharge - discount;

  const { data: users } = useQuery<Tables<'users'>, Error, Tables<'users'>>({
    queryKey: ['users'],
    queryFn: () => api.auth.getUser()
  });
  const payRequest = async () => {
    if (!users) {
      return toast({
        description: '로그인 후 이용 가능합니다.'
      });
    }
    if (product.length === 0) {
      return toast({
        description: '구매할 상품을 선택 해 주세요.'
      });
    }
    toast({
      variant: 'destructive',
      description: '가결제입니다. 즉시 환불 처리 됩니다.'
    });
    const { name, email, id } = users;

    const requestOrderName = orderNameArr.join(',');

    const response = await PortOne.requestPayment({
      storeId: process.env.NEXT_PUBLIC_STORE_ID as string,
      channelKey: process.env.NEXT_PUBLIC_INICIS_CHANNEL_KEY,
      paymentId: `${newPaymentId}`,
      orderName: requestOrderName,
      totalAmount,
      currency: 'CURRENCY_KRW',
      payMethod: 'CARD',
      products: products as any,
      redirectUrl:
        process.env.NODE_ENV === 'production'
          ? `https://k-nostalgia.vercel.app/check-payment?totalQuantity=${totalQuantity}`
          : `http://localhost:3000/check-payment?totalQuantity=${totalQuantity}`,
      appScheme:
        process.env.NODE_ENV === 'production'
          ? `https://k-nostalgia.vercel.app/check-payment?totalQuantity=${totalQuantity}`
          : `http://localhost:3000/check-payment?totalQuantity=${totalQuantity}`,
      customer: {
        customerId: id,
        email: email as string,
        phoneNumber: '01000000000',
        fullName: name as string
      },
      windowType: {
        pc: 'IFRAME',
        mobile: 'REDIRECTION'
      },
      bypass: {
        inicis_v2: {
          acceptmethod: [`SKIN(#586452)`]
        }
      }
    });

    const paymentId = response?.paymentId;

    if (response?.code != null) {
      toast({
        variant: 'destructive',
        description: '결제에 실패했습니다. 다시 시도해주세요.'
      });
      return router.push(`${pathName}`);
    }

    router.replace(
      `/check-payment?paymentId=${paymentId}&totalQuantity=${totalQuantity}`
    );
  };

  return (
    <div>
      <button
        className="min-w-[165px] bg-primary-strong py-3 px-4 rounded-xl text-white w-full text-center text-base leading-7"
        onClick={payRequest}
      >
        바로 구매하기
      </button>
    </div>
  );
};

export default PayButton;
