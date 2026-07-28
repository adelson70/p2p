import { describe, expect, it } from 'vitest';
import { createRtcConfiguration, PUBLIC_STUN_SERVERS } from '@/features/connection/rtcConfig';

describe('rtcConfig', () => {
  it('includes multiple STUN servers for NAT traversal', () => {
    expect(PUBLIC_STUN_SERVERS.length).toBeGreaterThanOrEqual(3);
    for (const server of PUBLIC_STUN_SERVERS) {
      const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
      expect(urls.every((u) => u.startsWith('stun:'))).toBe(true);
    }
  });

  it('enables candidate pool and mux for WebRTC', () => {
    const cfg = createRtcConfiguration();
    expect(cfg.iceCandidatePoolSize).toBe(4);
    expect(cfg.bundlePolicy).toBe('max-bundle');
    expect(cfg.rtcpMuxPolicy).toBe('require');
  });
});
