"use client";
import { useState } from 'react';
import { Button } from './button';
import { Share2, Check } from 'lucide-react';

export function ShareButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: title ?? document.title, url });
        return;
      }
    } catch {
      // fallthrough to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };
  return (
    <Button variant="outline" size="sm" onClick={share}>
      {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />} Podeli
    </Button>
  );
}
