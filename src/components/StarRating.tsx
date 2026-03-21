import Image from "next/image";

interface StarRatingProps {
  count?: number;
  size?: number;
  type?: "green" | "yellow";
}

export default function StarRating({ count = 5, size = 20, type = "green" }: StarRatingProps) {
  const src = type === "yellow" ? "/assets/Homepage/star-yellow.svg" : "/assets/Resuable/star.svg";
  return (
    <div className="flex items-center gap-1">
      {[...Array(count)].map((_, i) => (
        <Image key={i} src={src} alt="star" width={size} height={size} />
      ))}
    </div>
  );
}
