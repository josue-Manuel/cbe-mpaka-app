# Security Specification for CBE Mpaka Firestore

## 1. Data Invariants
- A prayer request MUST be linked to a valid authenticated user (`userId`).
- A testimony MUST be linked to a valid authenticated user (`userId`).
- An admin is defined either by the email `josuemanueljsm@gmail.com` or by a record in the `members` collection with the role `admin`.
- Members cannot modify their own `role` or `status`.

## 2. The "Dirty Dozen" Payloads (Examples to deny)

1. **Identity Spoofing**: Updating a `prayer` with another user's `userId`.
2. **State Shortcutting**: Updating a `prayer` status from `pending` to `approved` without admin rights.
3. **Resource Poisoning**: Updating a `member` with a `role` field set to `admin`.
4. **PII Leak**: Attempting to read a sensitive `member` document as an unauthenticated or non-admin user (if restricted).
5. **Ghost Field Injection**: Adding an `isVerified: true` field to a `member` update.
6. **Orphaned Writes**: Creating a `contributionRecord` without a valid `userId`.
7. **Size Exhaustion**: Injecting a 2MB string into a `prayer.content` field.
8. **Terminal State Lock**: Updating an already `approved` testimony back to `pending`.
9. **Timestamp Spoofing**: Sending an `updatedAt` timestamp from the client that is 1 hour in the past.
10. **Query Scraping**: Performing a `list` query on `members` to attempt to scrape email addresses as a non-admin.
11. **Admin Escalation**: Attempting to create a new admin document directly.
12. **Rule Bypass**: Attempting to access collections not explicitly defined (`match /{document=**}`).

## 3. Test Runner
A `firestore.rules.test.ts` file will be created to verify these 12 scenarios.
