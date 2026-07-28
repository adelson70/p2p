import { describe, expect, it } from 'vitest';
import { isCosmeticBaitBlocked } from '@/features/adblock/detectAdblock';

describe('isCosmeticBaitBlocked', () => {
  it('returns false when bait metrics look visible', () => {
    expect(
      isCosmeticBaitBlocked(1, 1, {} as Element, {
        display: 'block',
        visibility: 'visible',
        opacity: '1',
      }),
    ).toBe(false);
  });

  it('returns true when bait is hidden like a cosmetic filter', () => {
    expect(
      isCosmeticBaitBlocked(0, 1, {} as Element, {
        display: 'block',
        visibility: 'visible',
        opacity: '1',
      }),
    ).toBe(true);

    expect(
      isCosmeticBaitBlocked(1, 1, null, {
        display: 'block',
        visibility: 'visible',
        opacity: '1',
      }),
    ).toBe(true);

    expect(
      isCosmeticBaitBlocked(1, 1, {} as Element, {
        display: 'none',
        visibility: 'hidden',
        opacity: '0',
      }),
    ).toBe(true);
  });
});
