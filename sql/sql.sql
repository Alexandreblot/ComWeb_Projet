USE comweb_project;



#--- Cleanup ----------------------------------------------------------

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;



#--- Users ------------------------------------------------------------

CREATE TABLE users
(
  id INT AUTO_INCREMENT,
  login VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  PRIMARY KEY(id)
)
engine = innodb;



#--- Products ---------------------------------------------------------

CREATE TABLE products
(
  id INT AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255),
  dimensions VARCHAR(50) NULL,
  userLogin VARCHAR(50),
  PRIMARY KEY(id),
  FOREIGN KEY (userLogin) REFERENCES users(login)
)
engine = innodb;




#--- Reviews ----------------------------------------------------------

CREATE TABLE reviews
(
  id INT AUTO_INCREMENT,
  productId INT NOT NULL,
  userLogin VARCHAR(50) NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (userLogin) REFERENCES users(login) ON DELETE CASCADE
)
engine = innodb;




#--- Data -------------------------------------------------------------

# -- Users --
INSERT INTO users(login, password, role) VALUES
('admin', SHA1('admin'), 'admin'),
('client1', SHA1('client1'), 'client'),
('client2', SHA1('client2'), 'client');



# -- Products --
INSERT INTO products(name, description, price, category, stock, image, dimensions, userLogin) VALUES
('Agnès Tachyon Plushie', 'Peluche Agnès Tachyon', 420.00, 'plushies', 10, 'img/plushie/agnes_tachyon.png', '100cm x 50cm', 'admin'),
('Tokai Teio Plushie', 'Peluche Tokai Teio édition limitée', 499.99, 'plushies', 5, 'img/plushie/tokai_teio.png', '100cm x 50cm', 'admin'),
('Special Week Figure', 'Figurine John Umamusume', 19.90, 'figures', 8, 'img/figure/special_week.png', '10cm x 4cm', 'admin'),
('Rice Shower Figure', 'Figurine Rice Shower', 24.90, 'figures', 4, 'img/figure/rice_shower.png', '8cm x 4cm', 'admin'),
('Uma Musume Poster', 'Poster HD Umamusume: The Beginning Of A New Era', 14.99, 'posters', 20, 'img/poster/umamusume_movie2.png', '80cm x 50cm', 'admin'),
('Keychain Gold Ship', 'Porte-clé Gold Ship', 9.99, 'goodies', 50, 'img/goodies/goldship.png', '5cm x 3cm', 'admin');



# -- Reviews --
INSERT INTO reviews(productId, userLogin, rating, comment) VALUES
(1, 'client1', 5, 'Incroyable qualité !'),
(1, 'client2', 4, 'Très bien mais un peu cher'),
(3, 'client1', 5, 'Super figurine'),
(5, 'client2', 3, 'Correct');






