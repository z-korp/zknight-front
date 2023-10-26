type Props = {
  isProcessing: boolean;
};

const TurnStatus = ({ isProcessing }: Props) => {
  return <div className="w-50">{isProcessing ? <p>Processing turn...</p> : <p>Your turn!</p>}</div>;
};

export default TurnStatus;
