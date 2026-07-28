import { describe, expect, it } from 'vitest';
import { resolvePairingApplyAction } from './pairingApply';

describe('resolvePairingApplyAction', () => {
  it('no-ops when offerer applies answer again while connecting', () => {
    expect(
      resolvePairingApplyAction('answer', 'offerer', 'connecting', false, false).kind,
    ).toBe('noop');
  });

  it('no-ops when offerer re-applies own invite while waiting for answer', () => {
    expect(
      resolvePairingApplyAction('offer', 'offerer', 'waitingAnswer', false, false).kind,
    ).toBe('noop');
  });

  it('applies answer when offerer is waiting for guest response', () => {
    expect(
      resolvePairingApplyAction('answer', 'offerer', 'waitingAnswer', false, false).kind,
    ).toBe('apply_answer');
  });

  it('no-ops when answerer already shared response', () => {
    expect(
      resolvePairingApplyAction('answer', 'answerer', 'connecting', false, true).kind,
    ).toBe('noop');
  });
});
