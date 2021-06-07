declare const window: any;
const Gtag = {
  init: (analyticsId) => {
    Gtag.analyticsId = analyticsId;
  },
  pageview: (url: null) => {
    if (window?.gtag) {
      window.gtag('config', window, Gtag.analyticsId, {
        page_path: url || window.location.href,
      });
    }
  },
  event: ({
    action, category, label, value,
  }) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  },
  analyticsId: null,
};

export default Gtag;
