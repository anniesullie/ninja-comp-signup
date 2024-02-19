# Ninja Competition signup helper

This is a simple web page to manage compeition sign ups for a ninja warrior
team in a spreadsheet. The main problem it solves is that all the parents need
to:
* Find a list of competitions
* Sign up their kids
* Tell the gym so the gym can schedule a coach to send.

This lets them do those things all in one place, based on a spreadsheet
managed by their kids' gym.

## Setting it up

### The spreadsheet

1. Create a new [Google Sheet](https://docs.google.com/spreadsheets/u/0/).
2. Change the name of the default worksheet to "Competitions".
3. Add a frozen row at the top with the following columns:
   1. "League" -- UNAA, FINA, WNL, etc. 
   2. "Date" -- Date of the competition, in whatever format you want
   3. "Gym" -- Name of the gym hosting the competition
   4. "City" -- City/State of the competition
   5. "Registration Link" -- Registration link parents will need to fully sign up.
4. Create a service account ([instructions](https://ai2.appinventor.mit.edu/reference/other/googlesheets-api-setup.html)).
5. Share the spreadsheet with the service account's email address (something like project-name@project-name-project.iam.gserviceaccount.com).
6. Record the details you'll need:
   1. The service account email address from step 5.
   2. The service account private key. You'll see it in the JSON you download when creating the service account; it's the `private_key` field and it should start with `-----BEGIN PRIVATE KEY-----`.
   3. The spreadsheet id, which is in the URL of the sheet. For example, the `<id>` in `https://docs.google.com/spreadsheets/d/<id>/edit`.

### The site
1. Fork this GitHub repo
2. [Create a Vercel account](https://vercel.com/signup) linked to your GitHub account.
3. [Import the forked repo into a new project](https://vercel.com/new).
4. [Set the following environment variables](https://vercel.com/docs/projects/environment-variables)
   1. `NEXT_PUBLIC_GYM_NAME`: the name of the gym your competition team is from.
   2. `GOOGLE_SHEETS_CLIENT_EMAIL`: The service account email from step 6.i above
   3. `GOOGLE_SHEETS_PRIVATE_KEY`: The private key from step 6.ii above
   4. `GOOGLE_SHEETS_ID`: the id from step 6.iii above
5. Deploy!
