import { NextPage } from "next";
import { useEffect } from "react";

const Wasm: NextPage = () => {
  useEffect(() => {
    (async () => {
      const wasm = await import("@/wasm/pkg");
      const { add } = await wasm.default();
      // eslint-disable-next-line no-console
      console.log(add(1, 2));
    })();
  }, []);

  return <div />;
};

export default Wasm;
