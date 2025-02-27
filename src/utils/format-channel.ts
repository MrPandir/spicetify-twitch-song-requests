export function formatChannel(str: string): string {
  const channel = (str ? str : "").toLowerCase();
  return channel[0] === "#" ? channel : "#" + channel;
}
