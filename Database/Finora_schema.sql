-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type = ANY (ARRAY['income'::text, 'expense'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.transactions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  category_id bigint NOT NULL,
  frequency text NOT NULL DEFAULT 'once'::text CHECK (frequency = ANY (ARRAY['once'::text, 'daily'::text, 'weekly'::text, 'monthly'::text, 'yearly'::text])),
  transaction_date date NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  recurring_transaction_id bigint,
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_recurring_transaction_id_fkey FOREIGN KEY (recurring_transaction_id) REFERENCES public.recurring_transactions(id),
  CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.monthly_budgets (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  budget_month date NOT NULL,
  budget_amount numeric NOT NULL CHECK (budget_amount > 0::numeric),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email_notifications_enabled boolean NOT NULL DEFAULT false,
  last_approaching_email_at timestamp with time zone,
  last_exceeded_email_at timestamp with time zone,
  CONSTRAINT monthly_budgets_pkey PRIMARY KEY (id),
  CONSTRAINT monthly_budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.category_budgets (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  category_id bigint NOT NULL,
  budget_month date NOT NULL,
  budget_amount numeric NOT NULL CHECK (budget_amount > 0::numeric),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email_notifications_enabled boolean NOT NULL DEFAULT false,
  last_approaching_email_at timestamp with time zone,
  last_exceeded_email_at timestamp with time zone,
  CONSTRAINT category_budgets_pkey PRIMARY KEY (id),
  CONSTRAINT category_budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT category_budgets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.savings_goals (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  target_amount numeric NOT NULL CHECK (target_amount > 0::numeric),
  current_amount numeric NOT NULL DEFAULT '0'::numeric CHECK (current_amount >= 0::numeric),
  target_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  description text NOT NULL,
  priority integer NOT NULL DEFAULT 1 CHECK (priority > 0),
  CONSTRAINT savings_goals_pkey PRIMARY KEY (id),
  CONSTRAINT savings_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.recurring_transactions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  category_id bigint NOT NULL,
  frequency text NOT NULL CHECK (frequency = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text, 'yearly'::text])),
  next_due_date date NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT recurring_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT recurring_transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT recurring_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Constraints
begin;

-- Categories must be either income or expense.
alter table public.categories
add constraint categories_transaction_type_check
check (transaction_type in ('income', 'expense'));

-- Transaction amounts must be positive.
alter table public.transactions
add constraint transactions_amount_positive
check (amount > 0);

-- Only allow these frequency values.
alter table public.transactions
add constraint transactions_frequency_check
check (
  frequency in ('once', 'daily', 'weekly', 'monthly', 'yearly')
);

-- Monthly budget amount must be positive.
alter table public.monthly_budgets
add constraint monthly_budgets_amount_positive
check (budget_amount > 0);

-- Category budget amount must be positive.
alter table public.category_budgets
add constraint category_budgets_amount_positive
check (budget_amount > 0);

-- Savings goal values must be positive.
alter table public.savings_goals
add constraint savings_goals_target_positive
check (target_amount > 0);

-- Savings current values must be zero or greater.
alter table public.savings_goals
add constraint savings_goals_current_nonnegative
check (current_amount >= 0);

-- Savings priority values must be positive.
alter table public.savings_goals
add constraint savings_goals_priority_positive
check (priority > 0);

commit;

--Row level security
begin;

-- Everyone who is logged in can view the predefined categories.
create policy "Authenticated users can view categories"
on public.categories
for select
to authenticated
using (true);


-- Users can only manage their own transactions.
create policy "Users can manage their own transactions"
on public.transactions
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);


-- Users can only manage their own monthly budgets.
create policy "Users can manage their own monthly budgets"
on public.monthly_budgets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);


-- Users can only manage their own category budgets.
create policy "Users can manage their own category budgets"
on public.category_budgets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);


-- Users can only manage their own savings goals.
create policy "Users can manage their own savings goals"
on public.savings_goals
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage their recurring transactions"
on public.recurring_transactions
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


commit;