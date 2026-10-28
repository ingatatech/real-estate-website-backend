# DEVELOPMENT RULES FOR THIS PROJECT

1. Follow the Current Task Only
Implement only the functionality explicitly requested in the current task.
Do not add features simply because they seem useful.
Do not start future functionality unless explicitly requested.
If a task is unclear and could affect architecture, database, security, or existing functionality, ask before making major changes.

2. Inspect Before Changing
Before modifying anything:
Inspect the existing project structure.
Read the relevant files.
Understand existing components, routes, APIs, models, database schema, and styling.
Reuse existing functionality whenever possible.
Do not create duplicate components, APIs, models, or pages.

3. Protect Existing Work
Do not rewrite working code unnecessarily.
Do not delete existing features without explicit permission.
Do not change unrelated files.
Do not replace the existing architecture just because another approach is possible.
Preserve existing functionality after every change.

4. Work Incrementally
Use this workflow:
Inspect → Plan → Implement → Test → Fix → Report
Complete the current task before moving to another task.
Do not combine several unrelated tasks into one implementation.

5. No Unrequested Features
Do NOT add any of the following unless specifically requested:
Payments, Chat/messaging, Notifications, AI features, Advanced analytics, Extra dashboards, Extra user roles, Social login, 2FA, External integrations, Extra pages, Extra navigation items, Extra database tables, Extra APIs, Unnecessary animations, Unnecessary libraries.

6. UI/UX Consistency
Use the existing design system consistently.
Primary palette: Deep Navy: #0F172A, Slate: #1E293B, Emerald: #10B981, Emerald Hover: #059669, Cool Gray: #F8FAFC, Charcoal: #334155, White: #FFFFFF
Maintain consistent: Typography, Spacing, Button sizes, Border radius, Cards, Forms, Icons, Navigation, Tables, Modals, Status badges.
Do not introduce random colors or unrelated visual styles.

7. Responsive Design
Every UI change must work properly on: Mobile, Tablet, Desktop. Avoid accidental horizontal scrolling and broken layouts.

8. Buttons and Actions
Buttons with the same purpose should have consistent: Size, Typography, Padding, Border radius, Visual style.
Every important action must be clearly visible.
Do not create buttons that do nothing unless they are explicitly intended as placeholders.

9. Forms
Forms must: Have clear labels, Validate input, Show useful error messages, Show loading states where necessary, Show success/failure feedback, Submit to the real backend when backend functionality exists.
Never show fake success messages for operations that did not actually succeed.

10. Database Rules
Before modifying the database: Inspect the existing schema, Reuse existing models where appropriate, Avoid duplicate entities, Use proper relationships, Use migrations for schema changes, Do not expose database credentials, Do not create unnecessary tables or fields.

11. Backend/API Rules
Before creating an endpoint: Check whether an existing endpoint already provides the required functionality. Reuse existing APIs where appropriate. Validate input on the server. Return consistent responses and errors. Never expose sensitive information or internal errors to users.

12. Authentication and Authorization
Authentication must be handled securely. Authorization must be enforced on the server. Users must only access functionality permitted for their role. Do not create new roles unless required. Do not bypass authentication or authorization for convenience.

13. Property Data
For real-estate functionality: Keep property fields consistent throughout the application. Use realistic and internally consistent data structures. Clearly identify demo/sample data. Do not present fabricated information as verified real-world property information.

14. Dependencies
Before installing a package: Check whether the functionality already exists. Check whether an existing dependency can provide it. Install a new dependency only when necessary. Keep dependencies minimal.

15. Code Quality
Write code that is: Simple, Readable, Modular, Maintainable, Reusable, Scalable.
Avoid: Duplicate code, Overengineering, Unnecessary abstractions, Unnecessary refactoring, Complex solutions for simple problems.

16. Performance
Avoid unnecessary: Large images, Heavy animations, API requests, Database queries, Dependencies, Re-renders, Client-side processing. Use efficient approaches appropriate for the current project.

17. Security
Never weaken security to make a feature work. Protect: Passwords, Authentication tokens/sessions, User information, Uploaded files, Database credentials, API keys, Sensitive configuration. Use environment variables for secrets.

18. Testing
Before declaring a task complete: Test the changed functionality. Check for console errors. Check for build errors. Check affected existing functionality. Test responsive behavior when UI was changed. Fix errors caused by your implementation. Do not claim something works without testing it.

19. Error Handling
When something fails: Identify the root cause. Fix the actual problem. Test the fix.
Do not use arbitrary workarounds such as: Disabling validation, Removing security controls, Hiding errors, Hardcoding temporary values, Changing unrelated code.

20. Git Safety
Before making significant changes: Check the current Git status. Do not reset the repository. Do not delete user work. Do not overwrite unrelated changes. Keep changes focused on the current task.

21. Do Not Assume Requirements
Do not invent business rules, workflows, roles, pricing logic, permissions, or features. If the requirement is not provided and the decision could materially affect the system, ask first. For minor UI decisions, follow the existing design system.

22. Current Task Boundary
Always identify the current task before coding. Use: CURRENT TASK: [specific task]
Only modify what is necessary to complete that task. Do not implement future tasks at the same time.

23. Completion Report
After completing a task, report:
Changed: What was implemented.
Files: Important files modified or created.
Tested: What was tested.
Result: Whether the task works.
Not Implemented: Any requested or possible functionality intentionally left for a future task.

24. Golden Rule
DO NOT DO MORE THAN THE CURRENT TASK REQUIRES.
When there are multiple possible implementations, prefer the simplest solution that: Solves the requested problem, Fits the existing architecture, Preserves existing functionality, Is secure, Is maintainable, Does not introduce unnecessary dependencies or features.

25. Technology Stack
Backend: Node.js, Express.js, TypeScript, TypeORM, PostgreSQL, REST APIs
Frontend: Next.js, TypeScript, Tailwind CSS

26. Analytics Tracking
The application includes analytics tracking for user engagement:
- Page Views: Automatically tracked on all public pages via PageViewTracker component in SiteShell
- Property Views: Tracked when users view property details pages (tracks session duration)
- Click Events: Tracked for phone calls, emails, WhatsApp clicks on contact pages and property details
- Backend Infrastructure: PageView, PropertyView, and ClickEvent entities with controllers at /analytics/* endpoints
- Frontend Utilities: src/utils/analytics.ts provides trackPageView, trackPropertyView, trackClickEvent functions
- Session Management: Session IDs stored in sessionStorage for user session tracking
- Silent Failure: Tracking failures are logged but don't break user experience
- Data Available In: Admin → Analytics dashboard (after sufficient data collection)

27. Map Integration
The application includes interactive map functionality for property locations:
- Implementation: Leaflet maps (React Leaflet)
- Location: frontend/src/components/map/PropertyMap.tsx
- Tile Provider: OpenStreetMap (free, no API key required)
- Features: Interactive markers, address popups, responsive design
- CSP Configuration: Helmet configured to allow Leaflet resources
- Security: No API keys to expose, uses free open-source tiles
- Integration: Used in PropertyDetails page to show property location
