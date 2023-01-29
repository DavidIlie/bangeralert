import * as React from "react";

import { api } from "../../../lib/api";

const CreateByCurrentListening: React.FC = () => {
  const { data, refetch } = api.spotify.currentListening.useQuery();

  return <div></div>;
};
export default CreateByCurrentListening;
