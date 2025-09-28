'use client';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-center">
      <h2 className="text-2xl font-bold text-white mb-2">Došlo je do greške</h2>
      <p className="text-gray-400 mb-6">Osvježi stranicu ili pokušaj ponovo.</p>
      <Button variant="neon" onClick={() => reset()}>Pokušaj ponovo</Button>
    </div>
  );
}
