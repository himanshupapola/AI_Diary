export const calculateAverageMood = (moodList, period = 'week') => {
  if (!Array.isArray(moodList) || moodList.length === 0) {
    return 'No data';
  }

  const days = period === 'month' ? 30 : 7;
  const recentMoods = moodList.slice(-days);

  const moodCounts = recentMoods.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(moodCounts));

  const mostFrequentMoods = Object.keys(moodCounts).filter(
    mood => moodCounts[mood] === maxCount,
  );

  const latestMood = [...recentMoods]
    .reverse()
    .find(mood => mostFrequentMoods.includes(mood));

  return latestMood;
};
