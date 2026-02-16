Bookmark Hub
This app was built to help users save website links and titles in one place. It uses a database to store data and Google for signing in.

What the app does
Google Login: The app uses Google OAuth so users can sign in without a password.

Saving Links: Users can enter a website title and a URL to save it to their list.

Real-time Updates: If the app is open in two different tabs, adding a link in one tab makes it show up in the other tab instantly.

Private Data: Security rules were added so that users only see the links they saved, not anyone else's.

Delete Function: There is a trash icon to remove links from the list.

Problems that were fixed
A few issues came up during the build, but they were all solved:

Cookie Error: The login was failing with a "cookieStore" error. This happened because Next.js 15 needs the code to "await" the cookies. The code was updated to fix this.

Wrong Folder: The login was showing a 404 error at first. The "callback" folder was in the wrong spot, so it was moved to the src/app folder to make it work.


Tools used
Next.js: For the main app structure.

Supabase: For the database, login, and real-time updates.

Tailwind CSS: For the dark theme and layout.