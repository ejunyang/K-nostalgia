import { DefaultImage } from '@/components/common/DefaultImage';
import { Tables } from '@/types/supabase';
import Image from 'next/image';
import Link from 'next/link';

interface FoodProps {
  item: Tables<'local_food'>;
}

export const FoodBox = ({ item }: FoodProps) => {
  const { title_image, food_name, description, price } = item;
  return (
    <Link href={`/local-food/${item.product_id}`}>
      <li>
        {title_image ? (
          <Image
            src={title_image}
            width={160}
            height={194}
            alt={`${food_name}이미지`}
            style={{
              width: 160,
              height: 194,
              objectFit: 'cover',
              borderRadius: '12px',
              border: '1px solid #FFF3E3'
            }}
          />
        ) : (
          <DefaultImage />
        )}
        <div>
          <h2 className="text-label-strong leading-7 mt-2">{food_name}</h2>
          <p className="text-label-light text-xs leading-4">{description}</p>
          <p className="text-label-light text-sm font-bold mt-2">{`${price?.toLocaleString()}원`}</p>
        </div>
      </li>
    </Link>
  );
};