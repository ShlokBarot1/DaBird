export const track = (eventName, data = {}) => {
  if (window.fbq) window.fbq('track', eventName, data);

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventName,
      url: window.location.href,
      value: data.value,
      currency: data.currency,
      contentIds: data.content_ids || data.contentIds,
    }),
  }).catch(() => {});
};
