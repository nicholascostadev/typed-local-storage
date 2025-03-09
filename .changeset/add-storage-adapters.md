---
"@nicholascostadev/typed-local-storage": minor
---

Added support for multiple storage backends:
- Created a storage adapter interface
- Added adapters for localStorage, AsyncStorage (React Native), and in-memory storage
- Updated API to support async/await for all operations
- Added configureStorage function to set the default adapter
- Maintained backward compatibility with existing localStorage API
- Added remove method to the getter/setter object 