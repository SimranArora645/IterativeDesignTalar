INSERT INTO valid_zip_codes (zip_code) VALUES (94016);

INSERT INTO plan (name, frequency, pricing, support_availability, online_reports, advanced_reports)
 VALUES ("Single Plan", "Every 2 weeks", 20, "False",  "True", "False");
INSERT INTO plan (name, frequency, pricing, support_availability, online_reports, advanced_reports)
 VALUES ("2-Person Plan", "Every week", 30, "False", "True", "True");
INSERT INTO plan (name, frequency, pricing, support_availability, online_reports, advanced_reports)
 VALUES ("Family Plan", "Every 3 days", 40, "True", "True", "True");

INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Apples", 2, "apple.jpg", 0.67, 'Fruit');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Apricots", 20, "apricots.jpg", 0.10, 'Fruit');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Bananas", 6, "banana.jpg", 0.58, 'Fruit');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Broccoli", 1, "broccoli.jpg", 1.35, 'Vegetables');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Carrots", 6, "carrot.jpg", 0.64, 'Vegetables');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Bundle of Grapes", 1, "grapes.jpg", 0.79, 'Fruit');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Oranges", 5, "oranges.jpg", 0.46, 'Fruit');
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Peaches", 4, "peaches.jpg", 0.57, 'Fruit');

INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Bottle of Coke", 1, "coke.jpg", 0.67, "Soda");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Bottle of Sprite", 1, "sprite.jpg", 0.10, "Soda");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Bottle of Pepsi", 1, "pepsi.jpg", 0.58, "Soda");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Gallon of Water", 1, "water_gallon.jpg", 1.35, "Water");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Bottles of Water", 24, "water_bottles.jpg", 0.64, "Water");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Gallon of Milk", 1, "milk_gallon.jpg", 1.35, "Milk");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Carton of Milk", 1, "milk_carton.png", 0.64, "Milk");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Pound of Mozarella", 1, "mozarella.jpg", 0.79, "Cheese");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Slices of Cheddar", 6, "cheddar.jpg", 0.79, "Cheese");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Box of Frosted Flakes", 1, "frosted_flakes.jpg", 0.46, "Kids' Cereal");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Box of Cocoa Pebbles", 1, "cocoa_pebbles.jpg", 0.57, "Kids' Cereal");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Box of Special K", 1, "special_k.jpg", 0.46, "Heart-Healthy Cereal");
INSERT INTO grocery_item (name, quantity, image, price, category)  VALUES ("Box of Cheerios ", 1, "cheerios.jpg", 0.57, "Heart-Healthy Cereal");