/**
 * Automated tests for MoodMate core logic (streak calculation, security hashing, sanitization).
 */

const assert = require('assert');

// 1. Sanitization Test
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

assert.strictEqual(
  escapeHtml('<script>alert("xss")</script>'),
  '&lt;script&gt;alert("xss")&lt;/script&gt;',
  'escapeHtml should safely escape script tags'
);

// 2. Legacy Hash Function Test
function legacyHash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = ((h << 5) - h) + c;
    h = h & h;
  }
  return Math.abs(h).toString(36) + s.length.toString(36);
}

assert.strictEqual(typeof legacyHash('password123'), 'string');
assert.strictEqual(legacyHash('password123'), legacyHash('password123'), 'Hash must be deterministic');
assert.notStrictEqual(legacyHash('pass1'), legacyHash('pass2'), 'Distinct passwords must yield distinct hashes');

// 3. Streak Calculation Logic Test
function calcStreak(history, referenceDate = new Date()) {
  if (!history || !history.length) return 0;

  const uniqueDates = [...new Set(history.map(i => new Date(i.date).toDateString()))];
  const sortedDates = uniqueDates.map(d => new Date(d)).sort((a, b) => b - a);

  let streak = 0;
  let expectedDate = new Date(referenceDate);
  expectedDate.setHours(0, 0, 0, 0);

  const hasToday = sortedDates.some(d => d.toDateString() === expectedDate.toDateString());

  // If user hasn't logged today yet, evaluate streak starting from yesterday
  if (!hasToday) {
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  for (const d of sortedDates) {
    if (d.toDateString() === expectedDate.toDateString()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (d < expectedDate) {
      break;
    }
  }

  return streak;
}

// Test empty history
assert.strictEqual(calcStreak([]), 0, 'Empty history must have 0 streak');

// Test today only
const now = new Date();
assert.strictEqual(
  calcStreak([{ date: now.toISOString() }], now),
  1,
  'Entry today must count as 1-day streak'
);

// Test yesterday only (streak preserved during current active day)
const yesterday = new Date(now);
yesterday.setDate(yesterday.getDate() - 1);
assert.strictEqual(
  calcStreak([{ date: yesterday.toISOString() }], now),
  1,
  'Entry from yesterday should maintain active 1-day streak until end of day'
);

// Test 3 consecutive days (today, yesterday, 2 days ago)
const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
assert.strictEqual(
  calcStreak([
    { date: now.toISOString() },
    { date: yesterday.toISOString() },
    { date: twoDaysAgo.toISOString() },
  ], now),
  3,
  'Three consecutive days must yield 3-day streak'
);

// Test gap (3 days ago, but neither today nor yesterday)
const threeDaysAgo = new Date(now);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
assert.strictEqual(
  calcStreak([{ date: threeDaysAgo.toISOString() }], now),
  0,
  'Broken streak with 2-day gap must yield 0 streak'
);

console.log('✅ All MoodMate core logic tests passed successfully!');
