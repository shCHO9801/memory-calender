CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(100) NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL
);

CREATE TABLE notes (
                       id BIGSERIAL PRIMARY KEY,
                       user_id BIGINT NOT NULL,
                       content TEXT NOT NULL,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL,

                       CONSTRAINT fk_notes_user
                           FOREIGN KEY (user_id)
                               REFERENCES users(id)
);

CREATE TABLE events (
                        id BIGSERIAL PRIMARY KEY,
                        user_id BIGINT NOT NULL,
                        note_id BIGINT,
                        title VARCHAR(255) NOT NULL,
                        description TEXT,
                        start_at TIMESTAMP NOT NULL,
                        end_at TIMESTAMP,
                        all_day BOOLEAN NOT NULL DEFAULT FALSE,
                        created_at TIMESTAMP NOT NULL,
                        updated_at TIMESTAMP NOT NULL,

                        CONSTRAINT fk_events_user
                            FOREIGN KEY (user_id)
                                REFERENCES users(id),

                        CONSTRAINT fk_events_note
                            FOREIGN KEY (note_id)
                                REFERENCES notes(id)
);