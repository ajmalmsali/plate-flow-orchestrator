-- Create enum types for order and item statuses
CREATE TYPE public.order_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE public.order_item_status AS ENUM ('pending', 'cooking', 'ready', 'served');
CREATE TYPE public.menu_section AS ENUM ('grill', 'salad', 'beverage', 'dessert', 'appetizer', 'main', 'soup');
CREATE TYPE public.user_role AS ENUM ('manager', 'captain', 'kitchen', 'admin');

-- Create kitchens table
CREATE TABLE public.kitchens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kitchen sections table
CREATE TABLE public.kitchen_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,
  printer_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create menu items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  section menu_section NOT NULL,
  kitchen_id UUID NOT NULL REFERENCES public.kitchens(id) ON DELETE CASCADE,
  cooking_time INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number INTEGER NOT NULL,
  order_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status order_status NOT NULL DEFAULT 'active',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  customer_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  status order_item_status NOT NULL DEFAULT 'pending',
  special_instructions TEXT,
  priority INTEGER NOT NULL DEFAULT 50,
  cooking_start_time TIMESTAMP WITH TIME ZONE,
  ready_time TIMESTAMP WITH TIME ZONE,
  served_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - later we'll add user-based restrictions)
CREATE POLICY "Allow all operations on kitchens" ON public.kitchens FOR ALL USING (true);
CREATE POLICY "Allow all operations on kitchen_sections" ON public.kitchen_sections FOR ALL USING (true);
CREATE POLICY "Allow all operations on menu_items" ON public.menu_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON public.order_items FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_kitchens_updated_at BEFORE UPDATE ON public.kitchens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_kitchen_sections_updated_at BEFORE UPDATE ON public.kitchen_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data with generated UUIDs
DO $$
DECLARE 
    kitchen_1_id UUID := gen_random_uuid();
    kitchen_2_id UUID := gen_random_uuid();
    kitchen_3_id UUID := gen_random_uuid();
    menu_1_id UUID := gen_random_uuid();
    menu_2_id UUID := gen_random_uuid();
    menu_3_id UUID := gen_random_uuid();
    menu_4_id UUID := gen_random_uuid();
    menu_5_id UUID := gen_random_uuid();
    menu_6_id UUID := gen_random_uuid();
    order_1_id UUID := gen_random_uuid();
    order_2_id UUID := gen_random_uuid();
    order_3_id UUID := gen_random_uuid();
BEGIN
    -- Insert kitchens
    INSERT INTO public.kitchens (id, name, location) VALUES 
    (kitchen_1_id, 'Main Kitchen', 'Ground Floor'),
    (kitchen_2_id, 'Grill Station', 'Ground Floor'),
    (kitchen_3_id, 'Cold Kitchen', 'Ground Floor');

    -- Insert kitchen sections
    INSERT INTO public.kitchen_sections (name, color, kitchen_id) VALUES
    ('Grill', '#ef4444', kitchen_2_id),
    ('Salad Station', '#22c55e', kitchen_3_id),
    ('Beverage', '#3b82f6', kitchen_1_id),
    ('Main Courses', '#f59e0b', kitchen_1_id),
    ('Appetizers', '#8b5cf6', kitchen_1_id),
    ('Desserts', '#ec4899', kitchen_3_id);

    -- Insert menu items
    INSERT INTO public.menu_items (id, name, section, kitchen_id, cooking_time, price) VALUES
    (menu_1_id, 'Grilled Chicken Breast', 'grill', kitchen_2_id, 15, 24.99),
    (menu_2_id, 'Caesar Salad', 'salad', kitchen_3_id, 5, 14.99),
    (menu_3_id, 'Fresh Orange Juice', 'beverage', kitchen_1_id, 2, 6.99),
    (menu_4_id, 'Beef Steak', 'main', kitchen_2_id, 20, 32.99),
    (menu_5_id, 'Bruschetta', 'appetizer', kitchen_1_id, 8, 12.99),
    (menu_6_id, 'Chocolate Cake', 'dessert', kitchen_3_id, 3, 8.99);

    -- Insert sample orders
    INSERT INTO public.orders (id, table_number, total, customer_name) VALUES
    (order_1_id, 12, 47.98, 'John Smith'),
    (order_2_id, 8, 38.98, 'Sarah Johnson'),
    (order_3_id, 15, 21.98, 'Mike Davis');

    -- Insert order items
    INSERT INTO public.order_items (order_id, menu_item_id, quantity, status, priority) VALUES
    (order_1_id, menu_1_id, 2, 'pending', 85),
    (order_1_id, menu_2_id, 1, 'pending', 75),
    (order_2_id, menu_4_id, 1, 'cooking', 90),
    (order_2_id, menu_3_id, 2, 'ready', 60),
    (order_3_id, menu_5_id, 1, 'pending', 80),
    (order_3_id, menu_6_id, 1, 'pending', 70);
END $$;