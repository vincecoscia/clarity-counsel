// src/server/services/subscriptionService.ts
import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';

export class SubscriptionService {
  constructor(private prisma: PrismaClient) {}

  async checkAndDecrementUsage(userId: string): Promise<{ success: boolean; usesLeft: number }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Subscription not found",
      });
    }

    if (subscription.usesLeft <= 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "No uses left in current billing period",
      });
    }

    const updatedSubscription = await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { usesLeft: subscription.usesLeft - 1 },
    });

    return { success: true, usesLeft: updatedSubscription.usesLeft };
  }
}