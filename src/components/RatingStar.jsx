import { useState, useRef, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useRating } from "../hooks/useRating";

export default function StarRating({ movieId, user }) {
  const [hover, setHover] = useState(null);
  const [localRating, setLocalRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const starRefs = useRef([]);

  const userId = user?.id;
  const { rating: savedRating, loading: ratingLoading, error: ratingError, saveRating } = useRating(movieId, userId);

  // Update local rating when saved rating changes
  useEffect(() => {
    setLocalRating(savedRating);
  }, [savedRating]);

  const getValue = (e, star) => {
    const rect = starRefs.current[star].getBoundingClientRect();
    const x = e.clientX - rect.left;
    return x < rect.width / 2 ? star + 0.5 : star + 1;
  };

  const handleRatingClick = async (e, i) => {
    const v = getValue(e, i);
    setLocalRating(v);
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await saveRating(v);
    setIsSaving(false);

    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  if (ratingLoading) {
    return <div className="text-gray-300 text-sm">Loading rating...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        {[0, 1, 2, 3, 4].map((i) => {
          const value = hover ?? localRating;
          const fill = Math.min(1, Math.max(0, value - i)) * 100;

          return (
            <button
              key={i}
              ref={(el) => (starRefs.current[i] = el)}
              onMouseMove={(e) => setHover(getValue(e, i))}
              onMouseLeave={() => setHover(null)}
              onClick={(e) => handleRatingClick(e, i)}
              disabled={isSaving}
              className="relative w-8 h-8 text-gray-300 hover:scale-110 transition disabled:opacity-50"
            >
              <FaStar className="w-8 h-8" />

              <div
                className="absolute top-0 left-0 overflow-hidden text-yellow-500 pointer-events-none"
                style={{ width: `${fill}%`, height: "100%" }}
              >
                <FaStar className="w-8 h-8" />
              </div>
            </button>
          );
        })}

        <span className="ml-2 text-sm font-semibold text-yellow-400">
          {(hover ?? localRating).toFixed(1)}
        </span>

        {isSaving && <span className="ml-2 text-sm text-gray-400">Saving...</span>}
        {saveSuccess && <span className="ml-2 text-sm text-green-400">✓ Saved</span>}
        {ratingError && <span className="ml-2 text-sm text-red-400">Error: {ratingError}</span>}
      </div>
      {savedRating > 0 && (
        <p className="text-xs text-gray-400">Your current rating: {savedRating.toFixed(1)} stars</p>
      )}
    </div>
  );
}
