# IDI variable search app

## To do:

- [x] store data in a static CSV
  - [ ] variable name, table, IDI versions
- [ ] react app to display data from CSV (stored as JSON using e.g., Papaparse)
- [ ] react app to filter data based on search term
- [ ] add description, quality, and url fields to static file
- [ ] on-click a variable displays details info (including the above)
- [ ] additionally, "add note" and "add tag" inputs - adds to a separate database:
  1. Firestore Database (limits on number of reads might be too low for future features - but does have some offline caching options which might fix this)
  2. Google Sheets (would be publically visible to app can read from it; probably slower for searching)
  3. Some other database
- [ ] Goals of the database:
  1. Store additional user-provided information (that will be verified by admin before being displayed) - this includes notes and tags (for now)
  2. Allow admin to confirm/edit/delete information
  3. Free hosting (at least while app is low-use), but scalable (Firestore massively better in that respect)
- [ ] Add R script for importing new variables and adding into CSV
  - [ ] Merge new variables in
  - [ ] New column for each IDI refresh (with binary value for if that variable is in that refresh)
