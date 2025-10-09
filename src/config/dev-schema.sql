CREATE TABLE IF NOT EXISTS role (
    id INTEGER PRIMARY KEY,
    label TEXT NOT NULL
);

DELETE FROM role;
INSERT INTO role (id, label)
VALUES
    (1, 'Admin'),
    (2, 'Reviewer'),
    (3, 'Author')
;

CREATE TABLE IF NOT EXISTS address (
    id INTEGER PRIMARY KEY,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country_id INTEGER
);

CREATE TABLE IF NOT EXISTS institution (
    id INTEGER PRIMARY KEY,
    name TEXT,
    address_id INTEGER,

    FOREIGN KEY (address_id)
    REFERENCES address (id)
);

CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (DATETIME()),
    updated_at TEXT NOT NULL DEFAULT (DATETIME()),
    deleted_at TEXT,

    name_first TEXT NOT NULL,
    name_last TEXT NOT NULL,
    name_middle TEXT,
    title TEXT,
    degree TEXT,
    nickname TEXT,
    email TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL,
    phone TEXT,
    bio TEXT,
    institution_id INTEGER,
    department TEXT,
    address_id INTEGER,

    FOREIGN KEY (institution_id)
    REFERENCES institution (id),

    FOREIGN KEY (address_id)
    REFERENCES address (id)
);

CREATE TABLE IF NOT EXISTS user_role (
    user_id INTEGER,
    role_id INTEGER,

    PRIMARY KEY (user_id, role_id),

    FOREIGN KEY (user_id) REFERENCES user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,

    FOREIGN KEY (role_id) REFERENCES role (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS custom_form (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS custom_form_item_type (
    id INTEGER PRIMARY KEY,
    label TEXT NOT NULL,
    component TEXT NOT NULL
);

DELETE FROM custom_form_item_type;
INSERT INTO custom_form_item_type (id, label, component)
VALUES
    (1, 'Input', 'PInput'),
    (2, 'Dropdown Select', 'PSelect'),
    (3, 'Checkbox', 'PCheckbox'),
    (4, 'Radio', 'PRadio'),
    (5, 'Date Select', 'PDate')
;

CREATE TABLE IF NOT EXISTS custom_form_item (
    id INTEGER PRIMARY KEY,
    custom_form_id INTEGER,
    custom_form_item_type_id INTEGER NOT NULL,
    order_number INTEGER,
    options TEXT NOT NULL,

    FOREIGN KEY (custom_form_id)
    REFERENCES custom_form (id),

    FOREIGN KEY (custom_form_item_type_id)
    REFERENCES custom_form_item_type (id)
);

CREATE TABLE IF NOT EXISTS submissions ()