import { useState } from "react";

const FunFact = () => {
  // 🇺🇸 English fun facts
  const funFactsEN = [
    "Morning sickness hit me hard in the first trimester 🤢",
    "Certain smells instantly made me feel sick",
    "I’ve been craving sweets nonstop 🍭",
    "I’ve been craving both sweet and salty",
    "Fruit has been my go-to snack lately 🍓",
    "My skin has been super clear ✨",
    "I’ve been way more emotional than usual 🥺",
    "Energy has been pretty low most days",
    "I’ve been sleeping a lot more than usual 😴",
    "The baby’s heartbeat has been right in the middle range 💗",
    "I’ve had random food aversions out of nowhere 🤮",
    "Spicy food suddenly tastes AMAZING 🌶️",
    "I cry over the smallest things lately 😅",
    "I feel little flutters sometimes 👶",
    "Back pain has been real 😩",
  ];

  // 🇻🇳 Vietnamese fun facts
  const funFactsVI = [
    "Ốm nghén rất nặng trong 3 tháng đầu 🤢",
    "Một số mùi làm mình buồn nôn ngay lập tức",
    "Thèm đồ ngọt liên tục 🍭",
    "Vừa thèm ngọt vừa thèm mặn 😆",
    "Trái cây là món ăn yêu thích gần đây 🍓",
    "Da trở nên đẹp hơn ✨",
    "Cảm xúc nhạy cảm hơn bình thường 🥺",
    "Năng lượng thấp hầu hết các ngày",
    "Ngủ nhiều hơn bình thường 😴",
    "Nhịp tim em bé ở mức trung bình 💗",
    "Tự nhiên ghét một số món ăn 🤮",
    "Đồ cay bỗng nhiên ngon hơn 🌶️",
    "Dễ khóc vì những chuyện nhỏ 😅",
    "Đôi khi cảm nhận được em bé cử động 👶",
    "Đau lưng khá nhiều 😩",
  ];

  // 🎯 Track current index
  const [index, setIndex] = useState(0);

  // 🎯 Track current language (EN or VI)
  const [isVietnamese, setIsVietnamese] = useState(false);

  // 🎯 Choose which array to use
  const currentFacts = isVietnamese ? funFactsVI : funFactsEN;

  // 🎯 Next fact
  const nextFact = () => {
    // Go to the next fact, and if we’re at the end, start over from the beginning.
    setIndex((prev) => (prev + 1) % currentFacts.length);
  };

  // 🎯 Toggle language
  const toggleLanguage = () => {
    setIsVietnamese((prev) => !prev);

    // reset index so it doesn't go out of range
    setIndex(0);
  };

  return (
    <div className="fun-fact-container">
      <h2>
        {isVietnamese
          ? "✨ Sự Thật Thú Vị Khi Mang Thai ✨"
          : "✨ Pregnancy Fun Facts ✨"}
      </h2>

      {/* 🌍 Language Toggle */}
      <button className="lang-btn" onClick={toggleLanguage}>
        {isVietnamese ? (
          <>
            <img src="https://flagcdn.com/us.svg" alt="US" width="20" /> Switch
            to English
          </>
        ) : (
          <>
            <img src="https://flagcdn.com/vn.svg" alt="VN" width="20" /> Chuyển
            sang tiếng Việt
          </>
        )}
      </button>

      {/* 💡 Current fact */}
      <p className="fun-fact-text">{currentFacts[index]}</p>

      {/* 🔁 Next button */}
      <button className="fun-fact-btn" onClick={nextFact}>
        {isVietnamese ? "Xem tiếp 💖" : "Show Another 💖"}
      </button>
    </div>
  );
};

export default FunFact;
