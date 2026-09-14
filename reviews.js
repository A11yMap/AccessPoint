// Reviews are stamped with the reviewer's own access needs.
// "Reviewed by a power wheelchair user" tells you far more than four stars does,
// and it lets the app float reviews from people like you to the top.

export const REVIEWS = [
  {
    id: 'r1', venueId: 'cafe-luna', author: 'Maya R.', needs: ['wheelchair'], stars: 5, date: '2026-08-04',
    body: 'Rolled straight in, no lip at all on the threshold. Tables are high enough to get my knees under and the accessible loo is a proper one with a real transfer space, not a broom cupboard with a rail screwed on.',
  },
  {
    id: 'r2', venueId: 'cafe-luna', author: 'Dev P.', needs: ['blind'], stars: 2, date: '2026-07-19',
    body: 'The kiosk is the whole problem. No audio, no headphone socket, and the staff hatch is not obvious — I stood for four minutes before someone noticed. Lovely coffee once I got it, but I would not come alone again.',
  },
  {
    id: 'r3', venueId: 'cafe-luna', author: 'Sam K.', needs: ['mute', 'sensory'], stars: 4, date: '2026-06-28',
    body: 'The touchscreen everyone else complains about is exactly why I like it — I can order without having to speak or lip-read a barista over the grinder. Gets loud at lunchtime though, and there is nowhere quieter to sit.',
  },
  {
    id: 'r4', venueId: 'the-anchor', author: 'Maya R.', needs: ['wheelchair'], stars: 1, date: '2026-05-30',
    body: 'Three steps and a 68cm door. The staff were genuinely kind about it and offered to bring a drink outside, which I appreciated, but sitting on the pavement while my friends are inside is not access.',
  },
  {
    id: 'r5', venueId: 'the-anchor', author: 'Joanne T.', needs: ['hoh'], stars: 2, date: '2026-04-11',
    body: 'Stone floors, low ceiling, no soft furnishing anywhere — it is a echo chamber. No loop at the bar. I gave up trying to follow the conversation after about twenty minutes.',
  },
  {
    id: 'r6', venueId: 'harbour-museum', author: 'Dev P.', needs: ['blind'], stars: 5, date: '2026-08-20',
    body: 'The audio description is excellent and, unusually, it covers the small objects as well as the headline exhibits. Braille labels on the ship models. Staff offered a guided touch tour without me having to ask twice.',
  },
  {
    id: 'r7', venueId: 'harbour-museum', author: 'Maya R.', needs: ['wheelchair'], stars: 4, date: '2026-07-02',
    body: 'The step-free entrance works well once you find it — but the sign is A5 and about 30m down a side lane. I went to the main steps first like everyone does. Put a proper sign at the front and this is a five.',
  },
  {
    id: 'r8', venueId: 'marlow-market', author: 'Sam K.', needs: ['sensory'], stars: 1, date: '2026-06-16',
    body: 'Tannoy every ninety seconds, flickering strip light over the freezers, and radio playing underneath it all. I left with half a basket. They do a quiet hour on Wednesday mornings which is a completely different shop.',
  },
  {
    id: 'r9', venueId: 'marlow-market', author: 'Maya R.', needs: ['wheelchair'], stars: 4, date: '2026-06-14',
    body: 'Wide aisles, level everywhere, good parking. Only gripe is the toilet is a large cubicle pretending to be accessible — no grab rails.',
  },
  {
    id: 'r10', venueId: 'harbourside-library', author: 'Joanne T.', needs: ['hoh'], stars: 5, date: '2026-09-02',
    body: 'The loop actually works, which I say because so often it is fitted and switched off. A librarian signed to a visitor ahead of me in the queue. Quiet room is bookable and genuinely quiet.',
  },
  {
    id: 'r11', venueId: 'harbourside-library', author: 'Aaron M.', needs: ['cognitive'], stars: 5, date: '2026-08-11',
    body: 'Signs use pictures as well as words and the floor plan by the door is easy to follow. Nobody rushed me at the desk. This is how it should be done.',
  },
  {
    id: 'r12', venueId: 'harbourside-station', author: 'Maya R.', needs: ['wheelchair'], stars: 3, date: '2026-09-05',
    body: 'Fine if you are going south. Platforms 3 and 4 are up 22 steps with no lift, so heading north means a staff-assisted detour via Northgate and about forty extra minutes. Booked assistance turned up on time, to be fair.',
  },
  {
    id: 'r13', venueId: 'northbank', author: 'Joanne T.', needs: ['hoh', 'mobility'], stars: 2, date: '2026-06-05',
    body: 'Every desk has a working loop and someone signs on Tuesdays — all of which is undone by two steps and a heavy door at the entrance. I can manage steps slowly; a friend of mine cannot manage them at all.',
  },
  {
    id: 'r14', venueId: 'quay-picturehouse', author: 'Joanne T.', needs: ['hoh'], stars: 3, date: '2026-07-22',
    body: 'Captioned showings are Tuesday evening and Sunday lunchtime only, which means I watch what is on then rather than what I want to see. The loop in Screen 1 is good.',
  },
  {
    id: 'r15', venueId: 'quay-picturehouse', author: 'Sam K.', needs: ['sensory', 'mute'], stars: 5, date: '2026-08-01',
    body: 'Relaxed screenings on Sundays are a lifeline — lights partly up, sound down, and nobody minds if you walk out and come back. Booking through the app means no counter conversation.',
  },
  {
    id: 'r16', venueId: 'lantern-park', author: 'Aaron M.', needs: ['cognitive', 'sensory'], stars: 4, date: '2026-07-31',
    body: 'The walled garden is the calmest place on the harbourside. Benches often enough that you always have somewhere to stop. Losing a star because the accessible toilet needs a RADAR key and there is no key on site.',
  },
  {
    id: 'r17', venueId: 'riverside-leisure', author: 'Joanne T.', needs: ['deaf'], stars: 2, date: '2026-08-29',
    body: 'The pool hoist and changing room are genuinely excellent. But there is no visual fire alarm anywhere in the building, including poolside. I asked and was told it is "on the list". I will not swim there alone.',
  },
  {
    id: 'r18', venueId: 'bridge-pharmacy', author: 'Maya R.', needs: ['wheelchair'], stars: 3, date: '2026-07-06',
    body: 'One step, but the bell is at a sensible height and someone came out with the ramp within a minute. Inside is very tight — I could not turn around and had to reverse out.',
  },
];

export const reviewsFor = venueId => REVIEWS.filter(r => r.venueId === venueId);

/** Reviews from people who share at least one of your needs come first. */
export function sortReviewsForProfile(reviews, needIds) {
  const mine = new Set(needIds ?? []);
  return [...reviews].sort((a, b) => {
    const aShared = a.needs.filter(n => mine.has(n)).length;
    const bShared = b.needs.filter(n => mine.has(n)).length;
    if (aShared !== bShared) return bShared - aShared;
    return b.date.localeCompare(a.date);
  });
}
