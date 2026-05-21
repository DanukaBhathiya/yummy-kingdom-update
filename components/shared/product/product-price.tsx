import { cn } from "@/lib/utils";

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  //Ensure two decimal places
  const stringValue = value.toFixed(2);
  //Get the int/float
  const [intValue, floatValue] = stringValue.split(".");

  return <p className={cn("text-2xl font-semibold tracking-tight", className)}>
    <span className="mr-0.5 text-xs align-super">Rs.</span>
    {intValue}
    <span className="text-xs align-super">.{floatValue}</span>
  </p>;
};

export default ProductPrice;
