'use client';

import { UserCircle, Info } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export function DemoLogin() {
  return (
    <div className="space-y-2">
      <Button asChild type="button" variant="outline" className="w-full" size="lg">
        <Link href="/demo">
          <UserCircle className="w-5 h-5 mr-2" />
          Туршиж үзэх 
        </Link>
      </Button>
      <div className="flex items-start gap-2 px-1">
        <Info className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">Бүртгэлгүйгээр демо хувилбарыг үзэх</p>
      </div>
    </div>
  );
}
