import * as React from "react";

//@ts-ignore
import StarRatings from "react-star-ratings";

const StarRating: React.FC<{
  stars: number;
  className?: string;
  starDimension?: string;
  starSpacing?: string;
  onClick: () => void;
}> = ({ stars, className, starDimension, starSpacing, onClick, ...rest }) => {
  return (
    <div className={className} {...rest} onClick={onClick}>
      <StarRatings
        rating={stars}
        numberOfStars={5}
        starDimension={starDimension}
        starRatedColor="#eab308"
        starSpacing={starSpacing}
      />
    </div>
  );
};

export default StarRating;
