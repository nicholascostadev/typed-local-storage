---
"@nicholascostadev/typed-local-storage": patch
---

Enhance logger utility with cross-platform compatibility by adding safety checks for console availability. This fix prevents runtime errors in environments where the console object or its methods might not be available, such as certain React Native configurations or custom JavaScript runtimes.
