INSERT INTO valid_zip_codes (zip_code) VALUES (94016);

INSERT INTO plan (name, frequency, pricing, support_availability, online_reports, advanced_reports)
 VALUES ("Single Plan", "Every 2 weeks", 20, "False",  "True", "False");
INSERT INTO plan (name, frequency, pricing, support_availability, online_reports, advanced_reports)
 VALUES ("2-Person Plan", "Every week", 30, "False", "True", "True");
INSERT INTO plan (name, frequency, pricing, support_availability, online_reports, advanced_reports)
 VALUES ("Family Plan", "Every 3 days", 40, "True", "True", "True");

INSERT INTO grocery_sources (name) VALUES ('Whole Foods');
INSERT INTO grocery_sources (name) VALUES ('Walmart');
INSERT INTO grocery_sources (name) VALUES ('Target');
INSERT INTO grocery_sources (name) VALUES ("Lehigh Valley Dairy Farm");

INSERT INTO grocery_category (id, parent, name) VALUES (0, NULL, 'Grocery Items');
INSERT INTO grocery_category (id, parent, name) VALUES (1, 0, 'Produce');
INSERT INTO grocery_category (id, parent, name) VALUES (2, 0, 'Cereal');
INSERT INTO grocery_category (id, parent, name) VALUES (3, 0, 'Dairy');
INSERT INTO grocery_category (id, parent, name) VALUES (4, 0, 'Beverages');
INSERT INTO grocery_category (id, parent, name) VALUES (5, 1, 'Fruit');
INSERT INTO grocery_category (id, parent, name) VALUES (6, 1, 'Vegetables');
INSERT INTO grocery_category (id, parent, name) VALUES (7, 2, 'Heart-Healthy Cereal');
INSERT INTO grocery_category (id, parent, name) VALUES (8, 2, "Kids' Cereal");
INSERT INTO grocery_category (id, parent, name) VALUES (9, 3, 'Milk');
INSERT INTO grocery_category (id, parent, name) VALUES (10, 3, "Cheese");
INSERT INTO grocery_category (id, parent, name) VALUES (11, 4, 'Soda');
INSERT INTO grocery_category (id, parent, name) VALUES (12, 4, 'Water');

CREATE TABLE IF NOT EXISTS grocery_category_closure AS 
WITH closure AS (SELECT id AS child, id AS parent, 0 AS depth FROM grocery_category
    UNION ALL SELECT grocery_category.id AS child, closure.parent AS parent, closure.depth+1 AS depth FROM closure
    JOIN grocery_category ON closure.child=grocery_category.parent)
    SELECT * FROM closure;

INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Apples", 1, 'Each', "apple.jpg", 0.67, 'Fruit', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Apricots", 1, 'Each', "apricots.jpg", 0.70, 'Fruit', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Bananas", 1,'Each', "banana.jpg", 0.75, 'Fruit', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Broccoli, Organic", 1, 'Each', "broccoli.jpg", 1.35, 'Vegetables', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Carrots, Organic", 1, 'Each', "carrot.jpg", 0.86, 'Vegetables', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Bundle of Grapes, Organic", 1, 'Each', "grapes.jpg", 0.95, 'Fruit', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Oranges, Organic", 1, "Each", "oranges.jpg", 0.65, 'Fruit', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Peaches", 1, "Each", "peaches.jpg", 0.57, 'Fruit', 'Whole Foods');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Coca-Cola Soda Bottle", 8, 'oz', "coke.jpg", 1.67, "Soda", 'Walmart');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Sprite Bottle", 8, 'oz', "sprite.jpg", 1.40, "Soda", 'Walmart');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Pepsi Bottle", 8, "oz", "pepsi.jpg", 1.58, "Soda", 'Walmart');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Springhead Water", 1, "gallon", "water_gallon.jpg", 1.35, "Water", 'Walmart');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Nestle Water", 24, "bottles", "water_bottles.jpg", 7.64, "Water", 'Walmart');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Dairy Farm Milk", 1, "gallon", "milk_gallon.jpg", 4.35, "Milk", 'Lehigh Valley Dairy Farm');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Moo Cow Milk", 1, "carton", "milk_carton.png", 1.34, "Milk", 'Lehigh Valley Dairy Farm');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Mozarella", 16, "oz", "mozarella.jpg", 15.79, "Cheese", 'Lehigh Valley Dairy Farm');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Cheddar", 6.84, "oz", "cheddar.jpg", 5.99, "Cheese", 'Lehigh Valley Dairy Farm');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Kellogg's Frosted Flakes Cereal - Sweet Breakfast that Lets Your Great Out", 30.5, 'oz', "frosted_flakes.jpg", 5.46, "Kids' Cereal", 'Target');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Post Cocoa Pebbles Gluten Free Breakfast Cereal", 20.5, 'oz', "cocoa_pebbles.jpg", 4.99, "Kids' Cereal", 'Target');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Special K Breakfast Cereal Red Berries", 24, 'oz', "special_k.jpg", 7.99, "Heart-Healthy Cereal", 'Target');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Honey Nut Cheerios, Gluten Free Oat Cereal", 20, 'oz', "cheerios.jpg", 5.99, "Heart-Healthy Cereal", 'Target');
INSERT INTO grocery_item (name, quantity, quantity_units, image, price, category, source)  VALUES ("Coca-Cola Soda Soft Drink Pack", 12, 'bottles', "coke_12_pack.jpg", 8.99, "Soda", 'Walmart');