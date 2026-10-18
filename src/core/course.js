// Read-only views over the course map: ids, lookups, the recommended path.
import { tracks, units as rawUnits, path } from '../content/course.js';

export const pad2 = (n) => String(n).padStart(2, '0');
export const lessonId = (unitId, n) => `${unitId}-${pad2(n)}`;

export const units = rawUnits.map((u, ui) => {
  const track = tracks.find((t) => t.id === u.track);
  return {
    ...u,
    trackCode: track.code,
    lessons: u.lessons.map((l, i) => ({ ...l, id: lessonId(u.id, i + 1), n: i + 1, unit: u.id, track: u.track, phase: l.phase ?? u.phase })),
    order: ui,
  };
});

export { tracks, path };

const unitMap = new Map(units.map((u) => [u.id, u]));
const lessonMap = new Map(units.flatMap((u) => u.lessons.map((l) => [l.id, l])));

export const unitById = (id) => unitMap.get(id) || null;
export const lessonById = (id) => lessonMap.get(id) || null;
export const trackById = (id) => tracks.find((t) => t.id === id) || null;
export const allLessons = () => [...lessonMap.values()];
export const unitsOfTrack = (trackId) => units.filter((u) => u.track === trackId);
export const lessonsOfTrack = (trackId) => unitsOfTrack(trackId).flatMap((u) => u.lessons);

/** Every lesson in recommended order. */
export const pathLessons = () => path.flatMap((id) => unitMap.get(id).lessons);

/** Short code shown on lesson plates, e.g. "T1·ENGINE·02". */
export const lessonCode = (l) => `${trackById(l.track).code}·${l.unit.toUpperCase()}·${pad2(l.n)}`;

/** The latest build phase shipped. Units with a later phase show their phase tag. */
export const BUILT_PHASE = 3;
export const isAvailable = (l) => l.phase <= BUILT_PHASE;
