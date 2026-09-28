# Finora: Requirement Specifications

*By: Samuel Martin, Steven De Jesus, Wilfredo Cedano Ventura, William Hite*

# Table of contents

**Abstract**

**Tools & Technologies**

**Requirement List**

1\. User Account and Login

2\. Navigation

3\. Financial Dashboard

4\. Transaction History and Management

5\. Income Tracking	

6\. Expense Tracking

7\. Budget Planner

8\. Recurring Expenses

9\. Saving Goals

10\. Financial Warnings (Budget Planner)

# 

# **Abstract** 

College students often face the challenge of balancing limited income with the growing costs of education and everyday living. Managing expenses such as housing, transportation, food, school-related costs, and personal spending can become difficult, particularly when income comes from multiple or irregular sources. Finora is a financial management system designed specifically for college students to provide greater visibility into their finances and support better financial decision-making. The project aims to help students organize their money, plan for upcoming expenses, and build healthier financial habits while navigating college life.  
Finora will provide students with a centralized way to record income and expenses, organize transactions into meaningful categories, establish budgets, set savings goals, and review their spending patterns. Income may include employment earnings, financial aid, scholarships, refunds, and other sources commonly available to students. In addition to tracking financial activity, Finora will consider recurring and nonrecurring financial obligations to give users a more realistic understanding of the money they have available for discretionary spending. Financial warnings will notify students when their spending could place their budgets or goals at risk. By combining financial organization, planning, and awareness, Finora seeks to help students make thoughtful decisions about their money while balancing current expenses with future financial priorities.

# **Tools & Technologies** 

Finora will be developed as a responsive web application intended for use on both desktop and mobile devices. The following tools and technologies will be used throughout the project's development.

| Category | Tool / Technology | How It Will Be Used |
| ----- | ----- | ----- |
| **Application Platform** | Web Application | Finora will be available through a web browser and designed to function on both desktop and mobile screen sizes. |
| **Development Operating System** | Windows | Windows will serve as the primary operating system used by the team during development. |
| **Development Environment** | Visual Studio Code | The team will use Visual Studio Code to write, organize, and work with the project's files. |
| **Primary Language** | TypeScript | TypeScript will be used to implement the main functionality and behavior of the application. |
| **Page Structure** | HTML | HTML will provide the structure and organization of content displayed to users. |
| **Page Styling** | CSS | CSS will be used to customize the appearance, layout, and responsiveness of Finora's pages. |
| **User Interface Library** | React | React will be used to build and manage the interactive parts of the user interface. |
| **Web Application Framework** | Next.js | Next.js will provide the main structure for organizing and developing the web application. |
| **Interface Framework** | Bootstrap | Bootstrap will assist with creating consistent layouts and interface elements that adapt to different screen sizes. |
| **Database Service** | Supabase | Supabase will maintain the application's stored information, including transactions, budgets, categories, recurring expenses, and savings goals. |
| **Database Language** | SQL | SQL will be used to work with and retrieve information stored within the application's database. |
| **User Authentication** | Supabase Authentication | Supabase Authentication will support account registration, login, logout, and access to information belonging to each user. |
| **Deployment and Hosting** | Vercel | Vercel will be used to publish and host Finora so the application can be accessed online. |
| **Version Control** | Git | Git will allow the team to keep a history of project changes and manage different contributions throughout development. |
| **Project Repository** | GitHub | GitHub will provide a shared location for the team's source files, documentation, and project changes. |
| **Team Communication** | Discord and Text Messaging | The team will communicate through Discord and text messages to coordinate responsibilities, discuss progress, and plan project work. |
| **AI Assistance** | ChatGPT Free | ChatGPT will be available as a supporting resource for understanding concepts, troubleshooting issues, reviewing work, and assisting with project documentation. |

# **Requirement List** 

1. ## **User Account and Login:**  

When the website opens it will prompt the user to sign in with their email and password in two text fields.

1. When the website opens it will prompt the user to sign in with their email and password.  
   2. There will be a text field for the email.  
   3. There will be a text field for the password.  
   4. There will be a Sign-In button.  
      1. Pressing the button will authenticate the user using the information in the text fields.  
      2. Successful authentication will direct the user to the financial dashboard.  
   5. There will be a create account button.  
      1. Pressing the button will direct the user to a new page.  
      2. The page will have a text field for the email.  
      3. The page will have a text field for the password.  
      4. There will be a confirm button.  
         1. Pressing the button will send a one time password to the user email.  
         2. Pressing the button will open another window.  
            1. There will be a text field for the one time password.  
            2. There will be a confirm button.  
               1. Pressing the button will authenticate the user using the one time password.  
               2. If successful, a new account will be created in the database using the entered email and password.  
               3. If not, text will appear informing the user that the one time password is invalid.  
            3. There will be a cancel button  
               1. Pressing the button will go back to the previous window.  
      5. There will be a cancel button.  
         1. Pressing the button will direct the user to the previous screen.

2. ##  **Navigation:**  

   1. There will be a top navigation on all pages of the website.  
   2. There will be a Dashboard button.  
      1. Pressing this button will direct the user to the financial dashboard page.  
   3. There will be a Budget Planner Button.  
      1. Pressing this button will direct the user to the budget planner page.  
   4. There will be a Goals button  
      1. Pressing this button will direct the user to the savings goals page.  
   5. There will be a Cashflow Tracking button  
      1. Pressing this button will direct the user to the cashflow tracking page.  
   6. If the screen is small, all buttons will be turned into a dropdown menu with the same functions.

3. ##  **Financial Dashboard:**  

   1. The page will display the user’s current account balance.  
   2. The page will display how much of the month’s budget is left.  
   3. The page will display the expected balance of the user’s account at the end of the month based on recurring expenses and sources of income that the user has entered previously.  
   4. The page will display a pie chart of the user’s spending in the last month by category.  
      1. There will be a food category.  
      2. There will be a housing category.  
      3. There will be a transportation category.  
      4. There will be a tuition category.  
      5. There will be an entertainment category.  
      6. There will be a utilities category.  
      7. There will be a subscriptions category.  
      8. There will be an other category.

4. ## **Transaction History and Management:**  

The website will have a page where users can enter any transactions and track the change in their account balance based on this.

1. There will be a list of prior transactions retrieved from the database.  
   1. Transactions will have a name.  
      2. Transactions will have an amount.  
      3. Transactions will have a category.  
      4. Transactions will have a frequency.  
      5. Transactions will have a date.  
      6. There will be a dropdown menu labeled ''sort by''  
         1. There will be an option for date (default).  
            1. This option will sort the list in descending order by date.  
         2. There will be an option for name.  
            1. This option will sort the list alphabetically by name.  
         3. There will be an option for amount.  
            1. This option will sort the list in descending order by amount.  
         4. There will be an option for category.  
            1. This will sort the list alphabetically by category  
         5. There will be an option for frequency.  
            1. This will sort the list from yearly to just once.  
         6.  If two or more items have the same sorting priority, they will be sorted by date, category, name, value, and then frequency.  
      7. There will be a button that inverts the sorting order.  
      8. There will be a dropdown menu labeled “filter.”  
         1. There will be an option for food.  
            1. This will hide all transactions that are not from the food category.  
         2. There will be an option for housing.  
            1. This will hide all transactions that are not from the housing category.  
         3. There will be an option for transportation.  
            1. This will hide all transactions that are not from the transportation category.  
         4. There will be an option for tuition.  
            1. This will hide all transactions that are not from the tuition category.  
         5. There will be an option for entertainment.  
            1. This will hide all transactions that are not from the entertainment category.  
         6. There will be an option for utilities.  
            1. This will hide all transactions that are not from the utilities category.  
         7. There will be an option for subscriptions.  
            1. This will hide all transactions that are not from the subscriptions category.  
         8. There will be an option for others.  
            1. This will hide all transactions that are not from the other category.  
         9. There will be an option for employment.  
            1. This will hide all transactions that are not from the employment category.  
         10. There will be an option for financial aid.  
             1. This will hide all transactions that are not from the financial aid category.  
         11. There will be an option for scholarship.  
             1. This will hide all transactions that are not from the scholarship category.  
         12. There will be an option for allowance.  
             1. This will hide all transactions that are not from the allowance category.  
         13. There will be an option for self employment.  
             1. This will hide all transactions that are not from the self employment category.  
         14. There will be an other income.  
             1. This will hide all transactions that are not from the other income category.  
      9. There will be an include/exclude toggle.  
         1. When set to include, does nothing.  
         2. When set to exclude, inverts the filter.  
      10. Transactions will have an edit button.  
          1. Pressing the button will open a pop up.  
             1. There will be a text field for the transaction name.  
             2. There will be a text field for the amount of money gained/lost.  
             3. There will be a dropdown menu for selecting a transaction category.  
                1. There will be a food category.  
                2. There will be a housing category.  
                3. There will be a transportation category.  
                4. There will be a tuition category.  
                5. There will be an entertainment category.  
                6. There will be a utilities category.  
                7. There will be a subscriptions category.  
                8. There will be an other category.  
                9. There will be an employment category.  
                10. There will be a financial aid category.  
                11. There will be a scholarship category.  
                12. There will be an allowance category.  
                13. There will be a self employment category.  
                14. There will be an other income category.  
             4. There will be a dropdown menu for selecting the frequency that the transaction is repeated.  
                1. There will be an option for just once.  
                2. There will be an option for daily.  
                3. There will be an option for weekly.  
                4. There will be an option for monthly.  
                5. There will be an option for yearly.  
             5. There will be a date picker.  
             6. All of the information will be auto filled with the existing transaction information,  
             7. There will be a confirm button  
                1. Pressing this button will update the database entry with the above information.  
             8. There will be a cancel button.  
                1. Pressing this button will close the popup.  
      11. Transactions will have a remove button.  
          1. Pressing this button will open a pop up asking the user to confirm.  
             1. There will be a confirm button,  
                1. Pressing this button will clear the transaction from the database.  
             2. There will be a cancel button.  
                1. Pressing this button will close the popup.

5. ## **Income Tracking:**  

This section will allow the user to record new income transactions information.

1. Button to Add Income: Will have a form where the user will input new income transaction, The form will include the following:  
   1. Income amount to be entered into an input box.  
      2. Income date to be selected on Date picker.  
      3. Income category DropDown list.  
         1. Income category will be a predefined list with the following options for the user to pick:  
            1. Employment.  
            2. Financial aid.  
            3. Scholarships.  
            4. Allowance.  
            5. Self Employment.  
            6. Other income.  
      4. Input box for income source or description.  
      5. A button to save the data to the database labeled “Add Income.”  
      6. A button to cancel and close the form labeled “cancel.”  
   2. Income validation: How the system will validate the input data. Validation will follow this rules:  
      1. The income amount must be greater than zero.  
      2. A transaction date will be required.  
      3. A category will be required.  
      4. Invalid information will cause an error message to be displayed.   
      5. Valid income entries will be added to the user records.

6. ## **Expense Tracking:** 

This section will allow the user to record new expenses transactions.

1. Button to Add Expense: Will have a form where the user will input new expense transaction information, The form will include the following:  
   1. Expense amount into input box.  
      2. Expense date to be selected on Date picker.  
      3. Expense category DropDown List.  
         1. Expense category will be a predefined list with the following options for the user to pick:  
            1. Food.  
            2. Housing.  
            3. Transportation.  
            4. Tuition.  
            5. Entertainment.  
            6. Utilities.  
            7. Subscriptions.  
            8. Other.  
      4. Optional Input box for description.  
      5. A button to save the data to the database labeled “Add Expense.”  
      6. A button to cancel and close the form labeled “Cancel.”  
   2. Expense validation: How the system will validate the input data. Validation will follow this rules:  
      1. The expense amount must be greater than zero.  
      2. A transaction date will be required.  
      3. A category will be required.  
      4. Invalid information will cause an error message to be displayed.   
      5. Valid expense entries will be added to the user records.

7. ## **Budget Planner:** 
 This page will allow the user to plan their spending for the coming months, setting limits for their spending in different categories.

1. Button to Create Monthly Budget : Users will be able to establish an overall monthly budget.   
   1. The user will enter the maximum amount they plan to spend during the month into an input box.   
      1. There will be a checkbox for the user to opt-in for email notifications for the monthly budget.  
      2. This page will display the current monthly budget if there is any.   
   2. Monthly Budget Progress   
      1. The system will compare total monthly expenses against the monthly budget.   
      2. There is going to be a small dashboard to display the following:   
         1. Total budget amount.   
         2. Amount spent.   
         3. Amount remaining.   
         4. Percentage of the budget used.   
         5. if the budget is exceeded, the amount over budget will be displayed.   
   3. Modify Monthly Budget   
      1. Users will be able to modify their monthly budget.   
      2. The updated budget will be reflected in the dashboard.   
   4. Category Budgets   
      1. Button to Create Category Budget: Users will be able to assign a spending limit to an expense category.  
         1. There will be a checkbox for the user to opt-in for email notifications for the category budget.   
      2.  The user will select a category from the predefined list.   
      3. The user will enter a budget amount.   
      4. The user will select the applicable month.   
   5. Category Budget Status   
      1. The system will calculate total spending in each budgeted category.   
      2. Each category budget will display:   
         1. Category name.   
         2. Budget amount.   
         3. Amount spent.   
         4. Amount remaining.   
         5. Percentage of the category budget used.   
         6. Warning labels or notifications will show when spending approaches or exceeds the category budget.   
   6. Modify Category Budget   
      1. Users will be able to edit category budgets.   
      2. Users will be able to remove category budgets.   
         

8. ## **Recurring Expenses:** {#recurring-expenses:}

   1. Button to Create Recurring Expense: Users will be able to create recurring expenses.  
      1. A recurring expense form will contain:   
         1. Expense name.   
         2. Amount.   
         3. Expense category from predefined list.   
         4. Recurrence frequency.  
         5. Next expected or due date.    
   2. Recurring Expense Management   
      1. Users will be able to view recurring expenses.   
      2. Users will be able to edit recurring expenses.   
      3. Users will be able to remove recurring expenses.   
   3. Recurring Expense Dashboard  
      1. Recurring expenses will be displayed as expected monthly obligations.   
      2. The dashboard will identify upcoming recurring expenses.   
         

9. ## **Saving Goals:**  

   1. There will be a list of savings goals created by the user.  
      1. Savings goals will include a name.  
      2. Savings goals will include a description.  
      3. Savings goals will include a cost.  
   2. There will be a button to add a saving goal.  
      1. Pressing this button will open a pop up.  
         1. There will be a text field for the name.  
         2. There will be a text field for the description.  
         3. There will be a text field for the cost.  
         4. There will be a confirm button.  
            1. Pressing this button will add the above information into the database and update the list.  
         5. There will be a cancel button.  
            1. Pressing this button will close the pop up.  
   3. Every month that the user ends while under budget will take however much money is saved off of the cost of the highest priority goal. Ending the month over budget will instead add to the goal.

10. ##  **Financial Warnings (Budget Planner):**  

The website will notify the user via email when they are approaching or exceeding their budget.

1. The system will check if the user opted in for monthly budget email notifications.  
   1. The system will check the percentage of monthly budget used.  
      1. The system will check if the percentage for the monthly budget used is equal to or greater than 80% but less than 100%  
         1. If true, the system will then send a warning email to notify the user that they are approaching the limit of their monthly budget.  
            2. The system will create a flag to prevent budget limit email notifications for the monthly budget from being sent for a period of 1 week.  
         2. The system will check if the percentage for the monthly budget used is equal to or greater than 100%.  
            1. If true, the system will then send a warning email to notify the user that they have exceeded their monthly budget.  
            2. The system will create a flag to prevent exceeding the budget email notifications for the monthly budget from being sent for a period of 1 week.  
   2. The system will check if the user opted in for a category budget email notifications.  
      1. The system will check the percentage of the category budget used.  
         1. The system will check if the percentage for the category budget used is equal to or greater than 80% but less than 100%  
            1. If true, the system will then send a warning email to notify the user that they are approaching the limit of their category budget.  
            2. The system will create a flag to prevent budget limit email notifications for this category budget from being sent for a period of 1 week.  
         2. The system will check if the percentage for the category budget used is equal to or greater than 100%.  
            1. If true, the system will then send a warning email to notify the user that they have exceeded their category budget.  
            2. The system will create a flag to prevent exceeding the budget email notifications for the monthly budget from being sent for a period of 1 week.


