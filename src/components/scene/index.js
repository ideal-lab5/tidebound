import React from "react";
import Lights from './lights';
import Terrain from "./terrain";

const Scene = (props) => (
  <>
    <Lights />
    <Terrain seed={props.seed} />
  </>
);

export default Scene;
