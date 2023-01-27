import * as React from "react";

//@ts-ignore
import StarRatings from "react-star-ratings";

const StarRating: React.FC<{
  stars: number;
  className?: string;
  starDimension?: string;
  starSpacing?: string;
}> = ({ stars, className, ...rest }) => {
  return (
    <StarRatings
      rating={stars}
      numberOfStars={5}
      className={className}
      starRatedColor="#eab308"
      {...rest}
    />
  );
};

export default StarRating;
