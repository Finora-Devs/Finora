Finora Database:

Required tables:

| Table | Purpose |
| :---- | :---- |
| categories | Predefined income and expense categories |
| transactions | Completed income and expense entries and recurring information |
| monthly\_budgets | Overall monthly spending limits |
| category\_budgets | Monthly limits for individual categories |
| savings\_goals | Goal name, description, target, progress, and priority |
| budget\_notification\_log | Records warning emails and enforces the one-week cooldown |

\-        User management: we do not need an user’s table because supabase provides an internal auth.users table to securely handle sign-ups, logins, and password.

 ![Finora database diagram](images/finora-database.png)

 

 

 

 

 

 

 

 

 

 

 

 

 

 

\-            Constraints:  
\- Categories must be either income or expense.  
\- Transaction amounts must be positive.  
\- Only allow these frequency values : once, daily, weekly, monthly, yearly.  
\- Monthly budget amount must be positive.  
\- Category budget amount must be positive.  
\- Savings goal values must be positive.  
\- Savings current values must be zero or greater.  
\- Savings priority values must be positive.  
   
\-            Row level security access:

These policies allow specifics operations from the web application into the database, that means that these are the operations you allowed to perform by pushing data front the back end into the database.

\-            Users can only view, manage and edit their own data

