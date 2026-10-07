<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep concise company previews on the index route and full content on dedicated company pages, because visitors need both a landing overview and shareable detail pages.
- Store company service content in a browser-safe data module, because all service listings and details must share the same source.
- Use CDN asset pointers for supplied logos and founder photographs, because original uploaded media should not inflate the source repository.
- Website requests use a shared Zod schema, a public TanStack server function and a narrowly granted database submission function, because visitors need validated submissions without accounts or access to other enquiries.
- Request rows are private to service-role management; submissions are rate-limited by email and idempotent by request ID, because anonymous visitors must not read customer details or create accidental duplicate requests.
