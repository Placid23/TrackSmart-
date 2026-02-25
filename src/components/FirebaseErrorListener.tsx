
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/lib/errors';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Firebase Security Error:', error);
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: `Operation: ${error.context.operation} at ${error.context.path}. Check your security rules.`,
      });
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
