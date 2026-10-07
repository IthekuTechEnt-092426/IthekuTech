# Independent pages and expanded navigation

## What will change
- Keep the existing landing-page sections, while adding dedicated pages for Services, About, Approach, Team, and Contact.
- Add a desktop Services dropdown listing all 13 services, with each item opening the Services page at that service.
- Update mobile navigation so all main pages and services remain easy to reach.
- Replace the compact footer with grouped links for company pages, every service, contact details, and a return-to-top action.
- Reuse the existing request form on the Contact and Services pages so visitors can still request services, quotations, and partnerships directly.

## Technical details
- Add TanStack route files for `/services`, `/about`, `/approach`, `/team`, and `/contact`, each with unique search metadata.
- Extract shared header, footer, page heading, and service presentation into focused reusable components.
- Keep service names and descriptions sourced from the existing shared company data module.
- Preserve the current gold, black, and white identity and verify desktop and mobile navigation after implementation.