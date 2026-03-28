-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view published recipes" ON recipes FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (is_published = TRUE);

-- Admin full access (check admin_profiles.is_admin)
CREATE POLICY "Admins can manage categories" ON categories FOR ALL 
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins can view all recipes" ON recipes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admins can insert recipes" ON recipes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admins can update recipes" ON recipes FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));
CREATE POLICY "Admins can delete recipes" ON recipes FOR DELETE 
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL 
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));

CREATE POLICY "Users can view own profile" ON admin_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON admin_profiles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND is_admin = TRUE));
