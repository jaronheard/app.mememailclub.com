const PostcardSuggestions = () => {
  const suggestions = [
    {
      emoji: "☀️",
      title: "Ray of Sunshine",
      description: "Share a moment that made you smile.",
    },
    {
      emoji: "✈️",
      title: "Travel Tales",
      description: "Recount an adventure or hidden gem from your travels.",
    },
    {
      emoji: "🍽",
      title: "Recipe Swap",
      description: "Share a cherished family recipe.",
    },
    {
      emoji: "🙏",
      title: "Heartfelt Thanks",
      description: "Express gratitude to someone special.",
    },
    {
      emoji: "🎨",
      title: "Daily Muse",
      description: "Describe art, a book, or music that inspired you today.",
    },
    {
      emoji: "🍃",
      title: "Nature’s Whisper",
      description: "Vividly describe a beautiful scene from nature.",
    },
    {
      emoji: "🏆",
      title: "Little Victories",
      description: "Celebrate a small win that brightened your day.",
    },
    {
      emoji: "📦",
      title: "Time Capsule",
      description: "Write about a cherished memory.",
    },
    {
      emoji: "🌌",
      title: "Starry Nights",
      description: "Describe the night sky or a star-gazing memory.",
    },
    {
      emoji: "🕊",
      title: "Dream Away",
      description: "Share a dream or aspiration.",
    },
    {
      emoji: "😂",
      title: "Joke Time",
      description: "Spread laughter with a funny joke or pun.",
    },
    {
      emoji: "🌟",
      title: "Wisdom Nuggets",
      description: "Share guiding advice for tough times.",
    },
    {
      emoji: "🐾",
      title: "Pet Chronicles",
      description: "Share a story about your furry friend.",
    },
    {
      emoji: "🎬",
      title: "Movie Night",
      description: "Recommend a must-watch movie or TV show.",
    },
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Stuck? Here are some ideas:
      </h2>
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} className="mb-2 flex items-center">
            <span className="mr-2 text-2xl">{suggestion.emoji}</span>
            <div>
              <h4 className="font-medium">{suggestion.title}</h4>
              <p className="text-sm text-gray-600">{suggestion.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostcardSuggestions;
