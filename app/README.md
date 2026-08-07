# Application Structure

This directory is the sole Nuxt application entry point.

- `features/<feature>` owns presentation, application, domain, infrastructure, and feature-specific types.
- `shared` contains cross-feature contracts and implementation-neutral helpers.
- `server` contains trusted API and Cloud Function integration code.

Dependencies must point inward:

```text
components -> composables -> application -> domain and ports -> infrastructure
```

Vue components and composables must not import feature infrastructure directly.
