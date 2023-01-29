import * as React from "react";

import StarRating from "../StarRating";

const SongStars: React.FC<{ stars: number; onClick: () => void }> = ({
  stars,
  onClick,
}) => {
  return (
    <StarRating
      stars={stars}
      starDimension="35px"
      starSpacing="5px"
      className="cursor-pointer"
      onClick={onClick}
    />
  );
};

export default SongStars;
