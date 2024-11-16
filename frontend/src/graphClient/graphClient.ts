import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";

// const cropCashConsumerUrl = "https://api.studio.thegraph.com/query/94953/cropcashconsumer/version/latest";
const cropCashLandNftUrl = "https://api.studio.thegraph.com/query/94953/cropcashlandnft/version/latest";

export const getFarmerNfts = async (farmerAddress: string) => {
  const query = gql`
    {
      transfers(where: { to: "${farmerAddress}" }) {
        id
        from
        to
        tokenId
        transactionHash
      }
    }
  `;
  return useQuery({
    queryKey: ["transfers", farmerAddress],
    queryFn: async () => {
      console.log("Getting graph data");
      const data = await request(cropCashLandNftUrl, query);
      console.log("GRAPHQL DATA", data);
      return data;
    },
  });
};
