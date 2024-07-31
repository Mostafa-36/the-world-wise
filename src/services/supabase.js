import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://scmudbedbuykwxyrkoxb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbXVkYmVkYnV5a3d4eXJrb3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0NDExMDYsImV4cCI6MjAzODAxNzEwNn0.jQKzbgCgMTQLYgSKG2g2R4MrI-TRs28lxVjET470348"
);
