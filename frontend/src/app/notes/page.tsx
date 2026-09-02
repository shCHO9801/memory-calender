"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function NotesPage() {
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    apiFetch("/api/notes?page=0&size=20")
      .then((data) => {
        setResult(JSON.stringify(data, null, 2));
      })
      .catch((error) => {
        setResult(String(error));
      });
  }, []);

  return (
    <main>
      <h1>Notes Page</h1>
      <pre>{result}</pre>
    </main>
  );
}
