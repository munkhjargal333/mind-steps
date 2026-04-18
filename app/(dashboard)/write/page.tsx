'use client';

// app/(dashboard)/write/page.tsx

import { useRouter } from 'next/navigation';
import { ActionContainer } from '@/shared/components/ActionContainer';

export default function WritePage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col h-full">
      <ActionContainer
        mode="authed"
        onBack={() => router.back()}
      />
    </div>
  );
}