'use client';

// app/(dashboard)/write/page.tsx
// ActionContainer-г тусдаа /write route болгосон
// Буцах товч дарахад router.back() → /home рүү буцна

import { useRouter } from 'next/navigation';
import { ActionContainer } from '@/shared/components/ActionContainer';

export default function WritePage() {
  const router = useRouter();

  return (
    <ActionContainer
      mode="authed"
      onBack={() => router.back()}
    />
  );
}