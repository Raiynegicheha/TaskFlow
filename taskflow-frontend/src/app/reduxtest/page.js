'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from '@/store/slices/testSlice';

export default function ReduxTest() {
  // Access Redux state
  const count = useSelector((state) => state.test.count);
  // Get dispatch function to send actions
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">🎉 TaskFlow Setup Test</CardTitle>
          <CardDescription>
            All components are working!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Checklist */}
          <div className="space-y-2">
            <p className="text-sm font-medium">✅ Next.js - Running</p>
            <p className="text-sm font-medium">✅ Tailwind CSS - Working</p>
            <p className="text-sm font-medium">✅ shadcn/ui - Installed</p>
            <p className="text-sm font-medium">✅ Redux - Testing below...</p>
          </div>
          
          {/* Redux Counter Test */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Redux Counter Test</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button 
                onClick={() => dispatch(decrement())}
                variant="outline"
                size="lg"
              >
                -
              </Button>
              <div className="text-4xl font-bold w-20 text-center">
                {count}
              </div>
              <Button 
                onClick={() => dispatch(increment())}
                variant="outline"
                size="lg"
              >
                +
              </Button>
            </div>
            <Button 
              onClick={() => dispatch(reset())}
              variant="secondary"
              className="w-full"
            >
              Reset Counter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}