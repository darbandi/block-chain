import React, { useEffect, useState } from "react";
import axios from "axios";

function Block() {
  const [state, setState] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("http://localhost:3000/api/blocks");
      console.log(response.data);
      setState(response.data);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>Blocks:</h1>
      {state.map((block) => (
        <div key={block.hash}>{block.hash}</div>
      ))}
    </div>
  );
}
export default Block;
