
drop policy if exists "Anyone can submit application" on public.applications;

create policy "Anyone can submit valid application"
  on public.applications for insert
  to anon, authenticated
  with check (
    char_length(student_name) between 2 and 80
    and char_length(father_name) between 2 and 80
    and char_length(class_applying) between 1 and 40
    and age between 3 and 25
    and char_length(contact) between 7 and 20
    and char_length(address) between 5 and 300
    and (previous_school is null or char_length(previous_school) <= 120)
    and status = 'pending'
    and notes is null
  );
