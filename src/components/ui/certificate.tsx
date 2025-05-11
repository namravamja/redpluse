// components/Certificate.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';

interface CertificateProps {
  name: string;
  event: string;
}

const Certificate = ({ name, event }: CertificateProps) => {
  return (
    <Card className="w-80 text-center shadow-lg">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="w-full text-left font-bold text-lg">Certificate of Blood Donation</div>
        <div className="mt-4 text-md font-semibold">Donated Blood In {event}</div>
        <div className="text-sm text-gray-600 mt-2">Awarded to {name}</div>
        <div className="mt-4 flex gap-4">
          <Button variant="ghost">
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
          <Button variant="destructive">
            <Download className="w-4 h-4 mr-1" /> Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Certificate;