# Marketing redesign preview

This revision uses the supplied September 27 HTML as its starting point, with the existing repository brand assets and lead endpoint.

## Preview

Serve this directory on port 8010: `python3 -m http.server 8010`.

## Experience

- Photo-led introduction and four industry selectors.
- Clickable daily workflow with keyboard-operable tabs and illustrative sample data.
- Industry-specific photos and workflow details.
- Monthly/yearly pricing retained from the supplied draft; selecting a plan prefills the demo notes.
- Editable time-planning calculator, FAQ disclosure panels, mobile menu and reduced-motion support.
- Existing Apps Script demo endpoint restored with validation, timeout and retry handling.

## Before publishing

The Google Apps Script service uses an opaque `no-cors` response. The interface therefore acknowledges dispatch without claiming verified receipt. Browser checks intercept submissions so no test leads are sent. Verify delivery in the production service separately.

Placeholder testimonials and unsupported headline performance metrics have been removed from the visible page. Pricing and feature descriptions otherwise originate from the supplied draft and should be confirmed before publication.

## Images

The brand logo and energy-distribution hero illustration come from this repository. Additional illustrative photography is downloaded locally from Unsplash:

- Industrial facility: https://images.unsplash.com/photo-1516937941344-00b4e0337589
- Solar installation: https://images.unsplash.com/photo-1509391366360-2e959784a276
- Drinking water: https://images.unsplash.com/photo-1548839140-29a749e1cf4d
- Alternate petroleum image: https://images.unsplash.com/photo-1545262810-77515befe149

Photography illustrates sectors; it does not depict EnergyAlly customers or facilities.

## Verification

Headless Chrome checks: workflow steps, industry selectors, pricing, calculator, FAQ, failed submission/retry, mobile menu, images and JavaScript errors. Responsive overflow checks at 390, 768 and 1440 pixels. Visual desktop/mobile screenshots inspected separately. No production deployment or remote push performed.
