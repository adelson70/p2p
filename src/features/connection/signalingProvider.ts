/** Reserved for Cloudflare Worker signaling (SDP/ICE only). */
export interface SignalingProvider {
  publish(roomId: string, payload: string): Promise<void>;
  subscribe(roomId: string, onMessage: (payload: string) => void): () => void;
}

export const manualSignalingOnly: SignalingProvider = {
  async publish() {
    throw new Error('Manual signaling only');
  },
  subscribe(): () => void {
    throw new Error('Manual signaling only');
  },
};
