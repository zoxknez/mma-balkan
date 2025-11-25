'use client';

import { Button } from '@/components/ui/button';

interface NewsPaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export function NewsPagination({ page, totalPages, isLoading, onPageChange }: NewsPaginationProps) {
  return (
    <div className="flex justify-center items-center mt-8 gap-4">
      <Button 
        variant="outline" 
        size="sm" 
        disabled={isLoading || page <= 1} 
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Prethodna
      </Button>
      <span className="text-gray-300 text-sm">
        Strana {page} / {totalPages || '—'}
      </span>
      <Button 
        variant="outline" 
        size="sm" 
        disabled={isLoading || page >= totalPages} 
        onClick={() => onPageChange(page + 1)}
      >
        Sledeća
      </Button>
    </div>
  );
}
