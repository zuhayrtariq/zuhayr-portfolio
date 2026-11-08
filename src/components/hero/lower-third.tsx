interface LowerThirdProps {
  className?: string;
}

const LowerThird = ({ className }: LowerThirdProps) => {
  return (
    <div className={className}>
      <p className="text-body font-bold leading-tight text-caption">Zuhayr Tariq</p>
      <p className="text-ui leading-tight text-fog">
        Lead Developer,{" "}
        <a
          href="https://www.starlingmx.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Starling MX
        </a>
      </p>
    </div>
  );
};

export default LowerThird;
