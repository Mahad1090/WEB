import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<NextResponse | T> => {
    try {
      const body = await request.json();
      const validatedData = schema.parse(body);
      return validatedData as T;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.issues[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }
  };
}

export function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (request: NextRequest): NextResponse | T => {
    try {
      const { searchParams } = new URL(request.url);
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      const validatedData = schema.parse(params);
      return validatedData as T;
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.issues[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      );
    }
  };
}
