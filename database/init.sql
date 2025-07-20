CREATE TABLE IF NOT EXISTS public.customers (
	customer_id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	password_hash TEXT NOT NULL,
	CONSTRAINT un_customer_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.products (
	product_id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	name TEXT NOT NULL,
    quantity INTEGER,
	description TEXT,
	price_cents INTEGER NOT NULL,
	size TEXT NOT NULL,
	gender TEXT NOT NULL,
	category TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS public.purchases (
	purchase_id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	customer_id uuid NOT NULL,
	purchase_date date NOT NULL,
	delivery_address TEXT NOT NULL,
	CONSTRAINT fk_customer 
		FOREIGN KEY (customer_id) 
			REFERENCES public.customers (customer_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.purchaseproduct (
	purchaseproduct_id uuid DEFAULT gen_random_uuid () PRIMARY KEY,
	purchase_id uuid NOT NULL,
	product_id uuid NOT NULL,
    product_amount INTEGER NOT NULL,
	CONSTRAINT fk_purchase 
		FOREIGN KEY (purchase_id)
			REFERENCES public.purchases(purchase_id) ON DELETE CASCADE,
	CONSTRAINT fk_product 
		FOREIGN KEY (product_id )
			REFERENCES public.products(product_id) ON DELETE CASCADE
);
