declare const window: any;

export const { GOOGLE_ANALYTICS } = process.env;

export const pageview = (url) => {
  window.gtag('config', GOOGLE_ANALYTICS, {
    page_path: url,
  });
};

export const event = ({
  action, category, label, value,
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
};
