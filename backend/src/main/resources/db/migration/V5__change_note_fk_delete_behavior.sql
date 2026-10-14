ALTER TABLE events
    ALTER COLUMN note_id DROP NOT NULL;

ALTER TABLE events
DROP CONSTRAINT fk_events_note;

ALTER TABLE events
    ADD CONSTRAINT fk_events_note
        FOREIGN KEY (note_id)
            REFERENCES notes(id)
            ON DELETE SET NULL;


ALTER TABLE todos
    ALTER COLUMN note_id DROP NOT NULL;

ALTER TABLE todos
DROP CONSTRAINT fk_todos_note;

ALTER TABLE todos
    ADD CONSTRAINT fk_todos_note
        FOREIGN KEY (note_id)
            REFERENCES notes(id)
            ON DELETE SET NULL;