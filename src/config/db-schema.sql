-- Table: public.lookup
-----------------------

DROP TABLE IF EXISTS public.lookup;

CREATE TABLE IF NOT EXISTS public.lookup
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    label text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT lookup_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.lookup
    OWNER to postgres;

-- Table: public.l_user_role
----------------------------

DROP TABLE IF EXISTS public.l_user_role;

CREATE TABLE IF NOT EXISTS public.l_user_role
(
    -- Inherited from table public.lookup: id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    -- Inherited from table public.lookup: label text COLLATE pg_catalog."default" NOT NULL
)
    INHERITS (public.lookup)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.l_user_role
    OWNER to postgres;

---------------------
INSERT INTO l_user_role (id, label) VALUES
(1, 'Admin'),
(2, 'Reviewer'),
(3, 'Author')
;

-- Table: public.trackable
--------------------------

DROP TABLE IF EXISTS public.trackable;

CREATE TABLE IF NOT EXISTS public.trackable
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    update_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT trackable_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.trackable
    OWNER to postgres;

-- Table: public.t_user
-----------------------

DROP TABLE IF EXISTS public.t_user;

CREATE TABLE IF NOT EXISTS public.t_user
(
    -- Inherited from table public.trackable: id integer NOT NULL,
    -- Inherited from table public.trackable: created_at timestamp with time zone NOT NULL DEFAULT now(),
    -- Inherited from table public.trackable: update_at timestamp with time zone NOT NULL DEFAULT now(),
    -- Inherited from table public.trackable: deleted_at timestamp with time zone,
    name_first text COLLATE pg_catalog."default" NOT NULL,
    name_last text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    email_verified boolean NOT NULL DEFAULT false,
    CONSTRAINT t_user_pkey PRIMARY KEY (id)
)
    INHERITS (public.trackable)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.t_user
    OWNER to postgres;