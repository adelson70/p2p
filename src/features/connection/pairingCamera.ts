/** Rear camera stream tuned for QR scanning (high resolution when supported). */
export async function getQrScannerVideoStream(): Promise<MediaStream> {
  const preferred: MediaStreamConstraints = {
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
  };

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia(preferred);
  } catch {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' } },
    });
  }

  const track = stream.getVideoTracks()[0];
  if (track?.applyConstraints) {
    const caps = track.getCapabilities?.();
    const maxW = caps?.width?.max;
    const maxH = caps?.height?.max;
    if (maxW && maxH) {
      try {
        await track.applyConstraints({
          width: { ideal: Math.min(1920, maxW) },
          height: { ideal: Math.min(1080, maxH) },
        });
      } catch {
        // keep default stream
      }
    }
  }

  return stream;
}
