-- Create the authors table
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,           -- Unique identifier for each author
    name VARCHAR(255) NOT NULL,      -- Author's name
    email VARCHAR(255) UNIQUE,       -- Author's email, must be unique
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for record creation
);

-- Create the books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,           -- Unique identifier for each book
    title VARCHAR(255) NOT NULL,     -- Title of the book
    published_date DATE,             -- Date when the book was published
    author_id INT NOT NULL,          -- Foreign key to the authors table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for record creation
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);
